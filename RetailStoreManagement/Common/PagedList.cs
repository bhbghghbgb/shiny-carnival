using Microsoft.EntityFrameworkCore;

namespace RetailStoreManagement.Common;

public class PagedList<T> : IPagedList<T>
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPrevious => Page > 1;
    public bool HasNext => Page < TotalPages;
    public IEnumerable<T> Items { get; set; }

    public PagedList(IEnumerable<T> items, int totalCount, int page, int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        Page = page;
        PageSize = pageSize;
    }

    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int page, int pageSize)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 20;
        if (pageSize > 100) pageSize = 100; // Giới hạn tối đa

        var count = await source.CountAsync();
        var items = await source.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedList<T>(items, count, page, pageSize);
    }

    public static PagedList<T> Create(IEnumerable<T> source, int page, int pageSize)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var count = source.Count();
        var items = source.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return new PagedList<T>(items, count, page, pageSize);
    }
}

public interface IPagedList<T>
{
    int Page { get; }
    int PageSize { get; }
    int TotalCount { get; }
    int TotalPages { get; }
    bool HasPrevious { get; }
    bool HasNext { get; }
    IEnumerable<T> Items { get; }
}