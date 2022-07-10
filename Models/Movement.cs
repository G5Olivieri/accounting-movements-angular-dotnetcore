namespace movements.Models;

public class Movement : ITimestamp
{
    public Guid ID { set; get; }
    public string Name { set; get; } 
    public string Description { set; get; }
    public int Amount { get; set; }
    public DateTime Date { get; set; }
    public MovementType Type { get; set; }
    public string Status { get; set; }
    public Guid UserID { get; set; }
    public Guid? PermanentCorrelationID { set; get; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}