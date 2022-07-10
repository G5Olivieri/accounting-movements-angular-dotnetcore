namespace movements.Models;

public class PermanentMovement : ITimestamp
{
    public Guid ID { set; get; }
    public Guid CorrelationID { set; get; }
    public Guid UserID { get; set; }
    public string Name { set; get; } 
    public string Description { set; get; }
    public int Amount { get; set; }
    public DateTime Start { get; set; }
    public DateTime? End { get; set; }
    public MovementType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}