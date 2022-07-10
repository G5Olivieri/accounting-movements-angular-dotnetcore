namespace movements.Models;

public class User : ITimestamp
{
    public Guid ID { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}