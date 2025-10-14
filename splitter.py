import re
from pathlib import Path

def parse_and_write_files(code_block: str, output_dir: str = "."):
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # Regex to match file headers like: // Interfaces/IRepository.cs
    file_pattern = re.compile(r'^//\s*(.+)$', re.MULTILINE)

    # Find all file headers
    matches = list(file_pattern.finditer(code_block))

    for i, match in enumerate(matches):
        file_path = match.group(1).strip()
        start = match.end()

        # Determine end of this file's code block
        end = matches[i + 1].start() if i + 1 < len(matches) else len(code_block)

        # Extract code for this file
        file_code = code_block[start:end].strip()

        # Write to file
        full_path = Path(output_dir) / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(file_code + "\n")

        print(f"✅ Created: {full_path}")

# Example usage
code_block = """
// Models/LoginRequest.cs
public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

// Models/LoginResponse.cs
public class LoginResponse
{
    public string Token { get; set; }
    public string Username { get; set; }
    public string Role { get; set; }
}

// Controllers/AuthController.cs
[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login(LoginRequest request)
    {
        return await _authService.LoginAsync(request);
    }
}
"""

parse_and_write_files(code_block)
