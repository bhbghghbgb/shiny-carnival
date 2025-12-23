# Hướng dẫn sử dụng Nix Flake cho môi trường phát triển

## 📋 Yêu cầu

- Nix đã được cài đặt trên hệ thống
- Nix Flakes đã được kích hoạt

## 🚀 Cài đặt

### 1. Kích hoạt Nix Flakes (nếu chưa có)

```bash
mkdir -p ~/.config/nix
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

### 2. Setup Direnv (Tự động load môi trường) ⚡

**Cách nhanh nhất - Sử dụng script tự động:**

```bash
cd /home/nguyen-thanh-hung/Documents/TapHoaNho/shiny-carnival
./setup-direnv.sh
```

Script này sẽ tự động:
- Cài đặt direnv (nếu chưa có)
- Cấu hình shell hook (bash/zsh/fish)
- Kích hoạt direnv trong thư mục dự án

Sau khi chạy script, reload shell:
```bash
source ~/.bashrc  # hoặc source ~/.zshrc nếu dùng zsh
```

**Hoặc setup thủ công** (xem phần dưới)

### 3. Vào môi trường phát triển

#### Cách 1: Sử dụng nix develop (thủ công)

```bash
nix develop
```

#### Cách 2: Sử dụng direnv (TỰ ĐỘNG - Khuyến nghị) ⭐

Direnv sẽ tự động load môi trường Nix mỗi khi bạn `cd` vào thư mục dự án.

**Bước 1: Cài đặt direnv**

```bash
# Cài đặt direnv qua Nix
nix profile install nixpkgs#direnv

# Hoặc nếu bạn dùng NixOS hoặc có nix-env:
nix-env -iA nixos.direnv
```

**Bước 2: Cấu hình shell**

Xác định shell bạn đang dùng:
```bash
echo $SHELL
# Kết quả: /bin/bash hoặc /bin/zsh hoặc /usr/bin/fish
```

**Nếu dùng Bash:**
```bash
# Thêm vào ~/.bashrc
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc

# Reload shell config
source ~/.bashrc
```

**Nếu dùng Zsh:**
```bash
# Thêm vào ~/.zshrc
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc

# Reload shell config
source ~/.zshrc
```

**Nếu dùng Fish:**
```bash
# Thêm vào ~/.config/fish/config.fish
echo 'direnv hook fish | source' >> ~/.config/fish/config.fish
```

**Bước 3: Cho phép direnv trong thư mục dự án**

```bash
# Vào thư mục dự án
cd /home/nguyen-thanh-hung/Documents/TapHoaNho/shiny-carnival

# Cho phép direnv (chỉ cần chạy 1 lần)
direnv allow
```

**Bước 4: Kiểm tra**

```bash
# Thoát khỏi thư mục
cd ..

# Vào lại thư mục dự án
cd shiny-carnival

# Bạn sẽ thấy thông báo từ direnv và shell hook tự động chạy
# Môi trường Nix đã được load tự động! 🎉
```

**Lưu ý:**
- Lần đầu tiên `direnv allow` có thể mất vài phút để build môi trường
- Nếu thấy cảnh báo, chạy `direnv allow` để xác nhận
- Direnv sẽ tự động unload môi trường khi bạn rời khỏi thư mục

### 4. Hiểu về file `.envrc`

File `.envrc` là file cấu hình cho direnv, nằm trong thư mục gốc của dự án. File này chịu trách nhiệm tự động load môi trường Nix development shell mỗi khi bạn vào thư mục dự án.

#### Mục đích của `.envrc`:

1. **Tự động load Nix shell**: Khi bạn `cd` vào thư mục dự án, direnv đọc `.envrc` và tự động load môi trường từ `flake.nix`
2. **Quản lý PATH**: Đảm bảo các công cụ từ Nix (yarn, node, dotnet) được ưu tiên trong PATH
3. **Cô lập môi trường**: Mỗi dự án có môi trường riêng, tự động load/unload khi vào/ra thư mục

#### Nội dung file `.envrc` trong dự án này:

```bash
# Đảm bảo nix command có sẵn trước khi load flake
# Thêm các đường dẫn nix phổ biến vào PATH trước
[ -d /nix/var/nix/profiles/default/bin ] && export PATH="/nix/var/nix/profiles/default/bin:$PATH"
[ -d ~/.nix-profile/bin ] && export PATH="$HOME/.nix-profile/bin:$PATH"

# Source nix profile từ các vị trí phổ biến
if [ -f /etc/profile.d/nix.sh ]; then
  source /etc/profile.d/nix.sh
elif [ -f ~/.nix-profile/etc/profile.d/nix.sh ]; then
  source ~/.nix-profile/etc/profile.d/nix.sh
elif [ -f /nix/var/nix/profiles/default/etc/profile.d/nix.sh ]; then
  source /nix/var/nix/profiles/default/etc/profile.d/nix.sh
fi

# Load flake development shell
use flake
```

#### Giải thích từng phần:

1. **Dòng 8-10**: Thêm PATH của Nix vào đầu PATH để đảm bảo `nix` command có sẵn trước khi direnv cố load flake
2. **Dòng 12-19**: Source Nix profile script để load đầy đủ môi trường Nix (kiểm tra các vị trí phổ biến)
3. **Dòng 22**: `use flake` - lệnh direnv để load development shell từ `flake.nix` trong thư mục hiện tại

#### Tại sao cần cấu hình này?

- **Vấn đề "chicken and egg"**: Direnv cần `nix` command để chạy `use flake`, nhưng `nix` có thể chưa có trong PATH khi direnv chạy
- **Xung đột với NVM**: Nếu bạn dùng NVM, yarn từ NVM có thể được ưu tiên hơn yarn từ Nix. File `.envrc` đảm bảo PATH từ Nix được ưu tiên
- **Tính nhất quán**: Đảm bảo mọi người trong team có cùng cách load môi trường

#### Khi nào cần chỉnh sửa `.envrc`?

- **Thêm biến môi trường**: Nếu bạn cần set biến môi trường cụ thể cho dự án
- **Thay đổi cách load**: Nếu bạn muốn thay đổi cách direnv load môi trường
- **Xử lý xung đột**: Nếu gặp vấn đề với NVM hoặc các công cụ khác

**Ví dụ thêm biến môi trường:**

```bash
# Thêm vào cuối file .envrc
export DATABASE_URL="postgresql://localhost:5432/mydb"
export API_KEY="your-api-key"
```

#### Lưu ý bảo mật:

- File `.envrc` được commit vào git, **KHÔNG** đặt secrets (API keys, passwords) trực tiếp vào file này
- Sử dụng file `.env` riêng (đã được thêm vào `.gitignore`) cho các giá trị nhạy cảm
- Sau khi chỉnh sửa `.envrc`, luôn chạy `direnv allow` để phê duyệt thay đổi

## 🛠️ Công cụ được cài đặt

- **Node.js 20 LTS**: Runtime cho frontend
- **Yarn 4.x**: Package manager cho frontend
- **.NET 9.0 SDK**: Framework cho backend
- **PostgreSQL 16**: Database server
- **Git, curl, jq**: Công cụ hỗ trợ

## 📝 Sử dụng

### Frontend

```bash
cd frontend

# Cài đặt dependencies (tự động khi vào shell)
yarn install

# Chạy development server
yarn dev

# Build production
yarn build

# Lint
yarn lint
```

### Backend

```bash
cd RetailStoreManagement

# Restore packages (tự động khi vào shell)
dotnet restore

# Chạy development server
dotnet run

# Build
dotnet build

# Chạy migrations
dotnet ef database update
```

### PostgreSQL

```bash
# Khởi động PostgreSQL (nếu cần)
pg_ctl -D ~/.postgresql/data start

# Hoặc sử dụng systemd service (nếu đã cài đặt)
sudo systemctl start postgresql
```

## 🔧 Troubleshooting

### Lỗi: "command not found: dotnet"

Đảm bảo bạn đã vào nix shell:
```bash
nix develop
```

### Lỗi: "node_modules not found"

Chạy lại:
```bash
cd frontend && yarn install
```

### Lỗi: "PostgreSQL connection failed"

Kiểm tra PostgreSQL đã chạy chưa và cấu hình connection string trong `appsettings.json`.

### Lỗi direnv: "direnv: error .envrc is blocked"

Chạy lệnh sau để cho phép direnv:
```bash
direnv allow
```

### Lỗi direnv: "direnv: not found"

Direnv chưa được cài đặt hoặc chưa được thêm vào PATH. Chạy:
```bash
nix profile install nixpkgs#direnv
# Sau đó reload shell
```

### Lỗi: "Corepack is about to download yarn-1.22.22.tgz"

**Nguyên nhân:**
- Bạn chưa vào nix shell (direnv chưa được allow hoặc chưa load)
- Corepack đang can thiệp và cố download yarn 1.x thay vì dùng yarn 4.x từ nix
- Yarn từ nvm đang được ưu tiên hơn yarn từ nix

**Giải pháp:**

1. **Đảm bảo đã vào nix shell:**
   ```bash
   # Kiểm tra direnv đã allow chưa
   direnv allow
   
   # Hoặc vào nix shell thủ công
   nix develop
   ```

2. **Kiểm tra yarn đang dùng từ đâu:**
   ```bash
   which yarn
   # Nếu thấy /nix/store/... thì đúng
   # Nếu thấy ~/.nvm/... thì sai - yarn từ nvm đang được dùng
   ```

3. **Kiểm tra yarn version:**
   ```bash
   yarn --version
   # Phải là 4.x (ví dụ: 4.10.3)
   # Nếu là 1.22.x thì đang dùng yarn từ nvm/corepack
   ```

4. **Nếu vẫn gặp vấn đề, disable corepack tạm thời:**
   ```bash
   # Trong nix shell, corepack đã được disable tự động
   # Nếu vẫn gặp vấn đề, chạy:
   export COREPACK_ENABLE_STRICT=0
   ```

5. **Nếu dùng nvm, tạm thời disable nvm trong nix shell:**
   ```bash
   # Nix shell sẽ tự động ưu tiên yarn từ nix
   # Nhưng nếu vẫn gặp vấn đề, có thể cần unset nvm:
   unset NVM_DIR
   ```

### Direnv không tự động load khi vào thư mục

1. Kiểm tra hook đã được thêm vào shell config chưa:
   ```bash
   grep "direnv hook" ~/.bashrc  # hoặc ~/.zshrc
   ```

2. Đảm bảo đã reload shell config:
   ```bash
   source ~/.bashrc  # hoặc source ~/.zshrc
   ```

3. Kiểm tra direnv đã được allow chưa:
   ```bash
   direnv status
   ```

4. Nếu vẫn không hoạt động, thử mở terminal mới.

### Lỗi: "nix: command not found" khi direnv load

**Nguyên nhân:**
- Direnv cần `nix` command để chạy `use flake`, nhưng `nix` chưa có trong PATH khi direnv chạy
- File `.envrc` chưa được cấu hình đúng để load nix trước

**Giải pháp:**

1. **Kiểm tra file `.envrc` có đúng không:**
   ```bash
   cat .envrc
   # Phải có các dòng thêm PATH và source nix profile
   ```

2. **Đảm bảo nix đã được cài đặt:**
   ```bash
   which nix
   # Nếu không tìm thấy, cài đặt Nix: https://nixos.org/download.html
   ```

3. **Kiểm tra các file nix profile có tồn tại không:**
   ```bash
   ls -la /etc/profile.d/nix.sh
   ls -la ~/.nix-profile/etc/profile.d/nix.sh
   ls -la /nix/var/nix/profiles/default/etc/profile.d/nix.sh
   ```

4. **Nếu vẫn lỗi, thử chạy direnv allow lại:**
   ```bash
   direnv allow
   ```

5. **Kiểm tra direnv có load được không:**
   ```bash
   direnv status
   direnv export bash | grep PATH
   ```

### Lỗi: ".envrc is blocked" sau khi chỉnh sửa

Sau khi chỉnh sửa file `.envrc`, direnv sẽ block file để đảm bảo an toàn. Bạn cần phê duyệt lại:

```bash
# Xem nội dung thay đổi
direnv diff

# Phê duyệt thay đổi
direnv allow
```

### Lỗi: Yarn vẫn không load từ Nix sau khi direnv allow

**Nguyên nhân:**
- PATH từ NVM đang được ưu tiên hơn PATH từ Nix
- Corepack đang can thiệp

**Giải pháp:**

1. **Kiểm tra yarn đang đến từ đâu:**
   ```bash
   which yarn
   # Phải là /nix/store/.../yarn-berry-4.12.0/bin/yarn
   # Nếu là ~/.nvm/... thì sai
   ```

2. **Kiểm tra PATH:**
   ```bash
   echo $PATH | tr ':' '\n' | head -5
   # Đường dẫn từ Nix phải đứng đầu
   ```

3. **Nếu vẫn sai, thử reload direnv:**
   ```bash
   cd ..
   cd shiny-carnival
   # Direnv sẽ tự động reload
   ```

4. **Hoặc reload thủ công:**
   ```bash
   direnv reload
   ```

## 📚 Tài liệu tham khảo

- [Nix Flakes Documentation](https://nixos.wiki/wiki/Flakes)
- [.NET 9.0 Documentation](https://learn.microsoft.com/dotnet/)
- [Node.js 20 Documentation](https://nodejs.org/docs/latest-v20.x/)

