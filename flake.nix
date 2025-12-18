{
  description = "Môi trường phát triển cho Retail Store Management System";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";  # Dùng unstable để có .NET 9.0
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        # Node.js version - sử dụng LTS 20
        nodejs = pkgs.nodejs_20;

        # .NET 9.0 SDK
        dotnet-sdk = pkgs.dotnet-sdk_9;

        # PostgreSQL 16
        postgresql = pkgs.postgresql_16;

        # Yarn - sử dụng yarn-berry (yarn 4.x)
        yarn = pkgs.yarn-berry;

        # Các công cụ phát triển
        devTools = with pkgs; [
          # Công cụ cơ bản (tr, grep, sed, head, v.v.)
          coreutils
          git
          curl
          jq
          # Công cụ để quản lý database
          postgresql
          # Công cụ để build .NET
          dotnet-sdk
          # Node.js và package manager
          nodejs
          yarn
          # TypeScript compiler (có thể cần global)
          nodePackages.typescript
          # ESLint (có thể cần global)
          nodePackages.eslint
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = devTools;

          shellHook = ''
            # Đặt PATH từ Nix TRƯỚC mọi thứ khác để đảm bảo ưu tiên tuyệt đối
            export PATH="${pkgs.lib.makeBinPath devTools}:$PATH"
            
            # Disable Corepack để tránh xung đột với yarn từ nix
            export COREPACK_ENABLE_STRICT=0
            # Xóa corepack khỏi hash table nếu có
            hash -d corepack 2>/dev/null || true
            
            echo "🚀 Retail Store Management System - Development Environment"
            echo "=================================================="
            echo ""
            echo "📦 Công cụ đã cài đặt:"
            echo "  • Node.js: $(node --version 2>/dev/null || echo 'N/A')"
            echo "  • Yarn: $(yarn --version 2>/dev/null || echo 'N/A')"
            echo "  • .NET SDK: $(dotnet --version 2>/dev/null || echo 'N/A')"
            echo "  • PostgreSQL: $(psql --version 2>/dev/null | head -n1 || echo '16.x (installed)')"
            echo ""
            echo "📁 Cấu trúc dự án:"
            echo "  • Frontend: ./frontend"
            echo "  • Backend: ./RetailStoreManagement"
            echo ""
            echo "🔧 Lệnh hữu ích:"
            echo "  • Frontend dev: cd frontend && yarn dev"
            echo "  • Backend dev: cd RetailStoreManagement && dotnet run"
            echo "  • Restore packages: cd frontend && yarn install"
            echo "  • Restore .NET: cd RetailStoreManagement && dotnet restore"
            echo ""
          '';

          # Biến môi trường
          DOTNET_ROOT = "${dotnet-sdk}";
          # PATH được set trong shellHook để đảm bảo ưu tiên
        };
      });
}

