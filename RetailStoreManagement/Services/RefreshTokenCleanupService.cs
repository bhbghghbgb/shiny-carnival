using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;

namespace RetailStoreManagement.Services;

/// <summary>
/// Background service để tự động xóa các refresh token đã hết hạn quá 3 ngày
/// Chạy mỗi ngày lúc 2:00 AM
/// </summary>
public class RefreshTokenCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<RefreshTokenCleanupService> _logger;
    private readonly TimeSpan _cleanupInterval = TimeSpan.FromDays(1); // Chạy mỗi ngày
    private readonly int _expirationDays = 3; // Xóa token đã hết hạn quá 3 ngày

    public RefreshTokenCleanupService(
        IServiceProvider serviceProvider,
        ILogger<RefreshTokenCleanupService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("RefreshTokenCleanupService đã khởi động");

        // Chờ đến 2:00 AM đầu tiên trước khi chạy lần đầu
        await WaitUntilNextCleanupTime(stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _logger.LogInformation("Bắt đầu cleanup expired refresh tokens...");
                
                await CleanupExpiredTokensAsync();

                _logger.LogInformation("Cleanup expired refresh tokens hoàn tất. Sẽ chạy lại sau 24 giờ.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cleanup expired refresh tokens");
            }

            // Chờ đến 2:00 AM ngày hôm sau
            await WaitUntilNextCleanupTime(stoppingToken);
        }
    }

    private async Task WaitUntilNextCleanupTime(CancellationToken stoppingToken)
    {
        var now = DateTime.Now;
        var nextRun = now.Date.AddDays(1).AddHours(2); // 2:00 AM ngày mai

        // Nếu đã qua 2:00 AM hôm nay, chạy ngay
        var today2AM = now.Date.AddHours(2);
        if (now < today2AM)
        {
            nextRun = today2AM;
        }

        var delay = nextRun - now;
        _logger.LogInformation($"Sẽ cleanup expired tokens vào lúc {nextRun:yyyy-MM-dd HH:mm:ss} (sau {delay.TotalHours:F2} giờ)");

        await Task.Delay(delay, stoppingToken);
    }

    private async Task CleanupExpiredTokensAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        try
        {
            // Tính thời điểm cutoff: tokens hết hạn trước thời điểm này sẽ bị xóa
            var cutoffDate = DateTime.UtcNow.AddDays(-_expirationDays);

            // Lấy tất cả tokens đã hết hạn quá 3 ngày
            var expiredTokens = await unitOfWork.UserRefreshTokens
                .GetQueryable()
                .Where(rt => rt.ExpiresAt < cutoffDate)
                .ToListAsync();

            if (expiredTokens.Count == 0)
            {
                _logger.LogInformation("Không có expired refresh tokens nào cần xóa");
                return;
            }

            // Xóa các tokens theo batch để hiệu quả hơn
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            dbContext.Set<UserRefreshToken>().RemoveRange(expiredTokens);
            await unitOfWork.SaveChangesAsync();

            _logger.LogInformation($"Đã xóa {expiredTokens.Count} expired refresh tokens (hết hạn trước {cutoffDate:yyyy-MM-dd HH:mm:ss} UTC)");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cleanup expired refresh tokens");
            throw;
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("RefreshTokenCleanupService đang dừng...");
        await base.StopAsync(cancellationToken);
    }
}

