namespace movements.Models;

public interface ITimestamp
{
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}