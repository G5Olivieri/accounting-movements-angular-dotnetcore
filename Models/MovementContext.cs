using Microsoft.EntityFrameworkCore;

namespace movements.Models;

public class MovementContext : DbContext
{
    public MovementContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Movement> Movements { get; set; }
    public DbSet<PermanentMovement> PermanentMovements { get; set; }
    public DbSet<User> Users { get; set; }

    public override int SaveChanges()
    {
        AddTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
    {
        AddTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void AddTimestamps()
    {
        var entities = ChangeTracker.Entries()
            .Where(x => x.Entity is ITimestamp && (x.State == EntityState.Added || x.State == EntityState.Modified));

        foreach (var entity in entities)
        {
            var now = DateTime.UtcNow; // current datetime

            if (entity.State == EntityState.Added)
            {
                ((ITimestamp)entity.Entity).CreatedAt = now;
            }
            ((ITimestamp)entity.Entity).UpdatedAt = now;
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .Entity<Movement>()
            .Property(e => e.CreatedAt)
            .HasDefaultValueSql("now()");
        modelBuilder
            .Entity<Movement>()
            .Property(e => e.ID)
            .HasDefaultValueSql("gen_random_uuid()");
        
        modelBuilder
            .Entity<PermanentMovement>()
            .Property(e => e.CreatedAt)
            .HasDefaultValueSql("now()");
        modelBuilder
            .Entity<PermanentMovement>()
            .Property(e => e.ID)
            .HasDefaultValueSql("gen_random_uuid()");
        modelBuilder
            .Entity<PermanentMovement>()
            .Property(e => e.CorrelationID)
            .HasDefaultValueSql("gen_random_uuid()");
        
        modelBuilder
            .Entity<User>()
            .Property(e => e.CreatedAt)
            .HasDefaultValueSql("now()");
        modelBuilder
            .Entity<User>()
            .Property(e => e.ID)
            .HasDefaultValueSql("gen_random_uuid()");
        modelBuilder
            .Entity<User>()
            .HasIndex(e => e.Username)
            .IsUnique();

    }
}