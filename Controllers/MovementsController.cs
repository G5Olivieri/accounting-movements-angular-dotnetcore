using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using movements.Models;

namespace movements.Controllers
{
    [EnableCors]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MovementsController : ControllerBase
    {
        private readonly MovementContext _context;
        private readonly ILogger<MovementsController> _logger;

        public MovementsController(MovementContext context, ILogger<MovementsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Movements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movement>>> GetMovements()
        {
            var userId = GetUserID();
            if (userId is null)
            {
                return Unauthorized();
            }
            if (_context.Movements == null)
            {
                return NotFound();
            }
            return await _context.Movements.Where(m => m.UserID == userId).ToListAsync();
        }

        // GET: api/Movements/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Movement>> GetMovement(Guid id)
        {
            var userId = GetUserID();
            if (userId is null)
            {
                return Unauthorized();
            }
            if (_context.Movements == null)
            {
                return NotFound();
            }

            var movement = await _context.Movements.FindAsync(id);
            
            if (movement == null)
            {
                return NotFound();
            }

            if (movement.UserID != userId)
            {
                return NotFound();
            }

            return movement;
        }

        // PUT: api/Movements/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovement(Guid id, Movement movement)
        {
            var userId = GetUserID();
            if (userId is null)
            {
                return Unauthorized();
            }
            if (id != movement.ID)
            {
                return BadRequest();
            }
            if (movement.UserID != userId)
            {
                return Unauthorized();
            }
            
            _context.Entry(movement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovementExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Movements
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Movement>> PostMovement(Movement movement)
        {
            var userId = GetUserID();
            if (userId == null)
            {
                return Unauthorized();
            }
            if (_context.Movements == null)
            {
                return Problem("Entity set 'MovementContext.Movements'  is null.");
            }

            movement.UserID = userId ?? throw new Exception("UserID is null");
            _context.Movements.Add(movement);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMovement", new { id = movement.ID }, movement);
        }

        // DELETE: api/Movements/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovement(Guid id)
        {
            var userId = GetUserID();
            if (userId == null)
            {
                return Unauthorized();
            }
            
            if (_context.Movements == null)
            {
                return NotFound();
            }

            var movement = await _context.Movements.FindAsync(id);
            if (movement == null)
            {
                return NotFound();
            }

            if (userId != movement.UserID)
            {
                return Unauthorized();
            }
            _context.Movements.Remove(movement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovementExists(Guid id)
        {
            return (_context.Movements?.Any(e => e.ID == id)).GetValueOrDefault();
        }
        
        private Guid? GetUserID()
        {
            var currentUser = HttpContext.User;
            var userId = currentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId is null)
            {
                return null;
            }

            return Guid.Parse(userId);
        }

    }
}