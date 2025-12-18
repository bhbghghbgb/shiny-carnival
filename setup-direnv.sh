#!/usr/bin/env bash
# Script tự động setup direnv cho dự án

set -e

echo "🔧 Thiết lập direnv cho Retail Store Management System"
echo "======================================================"
echo ""

# Kiểm tra Nix đã cài đặt chưa
if ! command -v nix &> /dev/null; then
    echo "❌ Nix chưa được cài đặt. Vui lòng cài đặt Nix trước:"
    echo "   https://nixos.org/download.html"
    exit 1
fi

echo "✅ Nix đã được cài đặt"

# Kiểm tra direnv đã cài đặt chưa
if ! command -v direnv &> /dev/null; then
    echo "📦 Đang cài đặt direnv..."
    nix profile install nixpkgs#direnv
    echo "✅ Direnv đã được cài đặt"
else
    echo "✅ Direnv đã được cài đặt"
fi

# Xác định shell
SHELL_NAME=$(basename "$SHELL")
echo ""
echo "🔍 Phát hiện shell: $SHELL_NAME"
echo ""

# Cấu hình shell
case "$SHELL_NAME" in
    bash)
        SHELL_CONFIG="$HOME/.bashrc"
        HOOK_COMMAND='eval "$(direnv hook bash)"'
        ;;
    zsh)
        SHELL_CONFIG="$HOME/.zshrc"
        HOOK_COMMAND='eval "$(direnv hook zsh)"'
        ;;
    fish)
        SHELL_CONFIG="$HOME/.config/fish/config.fish"
        HOOK_COMMAND='direnv hook fish | source'
        mkdir -p "$HOME/.config/fish"
        ;;
    *)
        echo "⚠️  Shell không được hỗ trợ tự động: $SHELL_NAME"
        echo "   Vui lòng thêm hook thủ công vào shell config của bạn:"
        echo "   eval \"\$(direnv hook $SHELL_NAME)\""
        exit 1
        ;;
esac

# Kiểm tra hook đã có chưa
if grep -q "direnv hook" "$SHELL_CONFIG" 2>/dev/null; then
    echo "✅ Direnv hook đã được cấu hình trong $SHELL_CONFIG"
else
    echo "📝 Đang thêm direnv hook vào $SHELL_CONFIG..."
    echo "" >> "$SHELL_CONFIG"
    echo "# Direnv hook - tự động load nix shell" >> "$SHELL_CONFIG"
    echo "$HOOK_COMMAND" >> "$SHELL_CONFIG"
    echo "✅ Đã thêm direnv hook"
    echo ""
    echo "⚠️  Vui lòng reload shell config:"
    echo "   source $SHELL_CONFIG"
    echo "   hoặc mở terminal mới"
fi

# Cho phép direnv trong thư mục hiện tại
echo ""
echo "🔐 Đang cho phép direnv trong thư mục dự án..."
if [ -f ".envrc" ]; then
    direnv allow
    echo "✅ Direnv đã được kích hoạt"
else
    echo "❌ Không tìm thấy file .envrc"
    exit 1
fi

echo ""
echo "🎉 Hoàn tất setup!"
echo ""
echo "📋 Các bước tiếp theo:"
echo "   1. Reload shell config: source $SHELL_CONFIG"
echo "   2. Thoát và vào lại thư mục dự án để kiểm tra"
echo "   3. Bạn sẽ thấy môi trường Nix tự động load khi vào thư mục"
echo ""

