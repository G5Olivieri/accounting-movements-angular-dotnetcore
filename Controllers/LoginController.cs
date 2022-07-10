using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using movements.Models;

namespace movements.Controllers;

[EnableCors]
[Route("api/[controller]")]
[ApiController]
public class LoginController : Controller
{
    private readonly ILogger<LoginController> _logger;
    private readonly IConfiguration _config;
    private readonly MovementContext _context;

    public LoginController(ILogger<LoginController> logger, IConfiguration config, MovementContext context)
    {
        _logger = logger;
        _config = config;
        _context = context;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] LoginDto loginDto)
    {
       _logger.LogInformation("Start login with {Username}:{Password}", loginDto.Username, loginDto.Password);
       var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == loginDto.Username);
       if (user is null)
       {
           return Unauthorized();
       }

       if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
       {
           return Unauthorized();
       }

       var expiresIn = 18000; // a half hour in seconds (30 * 60)
       var jwt = GenerateJSONWebToken(user, expiresIn);
       return Ok(new JwtGeneratedResponse(jwt, expiresIn));
    }
    
    private string GenerateJSONWebToken(User user, int expiresIn)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[] {
            new Claim(JwtRegisteredClaimNames.Sub, user.ID.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(_config["Jwt:Issuer"],
            _config["Jwt:Issuer"],
            claims,
            expires: DateTime.Now.AddSeconds(expiresIn),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}