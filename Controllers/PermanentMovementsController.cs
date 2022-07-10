using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using movements.Models;

namespace movements.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PermanentMovementsController : ControllerBase
    {
        private readonly MovementContext _context;
        private readonly ILogger<PermanentMovementsController> _logger;

        public PermanentMovementsController(MovementContext context, ILogger<PermanentMovementsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/PermanentMovements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PermanentMovement>>> GetPermanentMovements()
        {
            var userId = GetUserID();
            if (userId == null)
            {
                return Unauthorized();
            }
            if (_context.PermanentMovements == null)
            {
                return NotFound();
            }

            return await _context.PermanentMovements.Where(p => p.UserID == userId).ToListAsync();
        }

        // GET: api/PermanentMovements/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PermanentMovement>> GetPermanentMovement(Guid id)
        {
            var userId = GetUserID();
            if (userId == null)
            {
                return Unauthorized();
            }
            if (_context.PermanentMovements == null)
            {
                return NotFound();
            }

            var permanentMovement = await _context.PermanentMovements.FindAsync(id);

            if (permanentMovement == null)
            {
                return NotFound();
            }

            if (permanentMovement.UserID != userId)
            {
                return Unauthorized();
            }

            return permanentMovement;
        }

        // PUT: api/PermanentMovements/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPermanentMovement(Guid id, PermanentMovement permanentMovement)
        {
            var userId = GetUserID();
            if (userId == null)
            {
                return Unauthorized();
            }
            if (id != permanentMovement.ID)
            {
                return BadRequest();
            }

            if (userId != permanentMovement.UserID)
            {
                return Unauthorized();
            }
            
            _context.Entry(permanentMovement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PermanentMovementExists(id))
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

        // POST: api/PermanentMovements
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PermanentMovement>> PostPermanentMovement(PermanentMovement permanentMovement)
        {
            var userId = GetUserID();
            if (userId == null)
            {
                return Unauthorized();
            }
            if (_context.PermanentMovements == null)
            {
                return Problem("Entity set 'MovementContext.PermanentMovements'  is null.");
            }

            permanentMovement.UserID = userId ?? throw new Exception("UserID is null");
            
            _context.PermanentMovements.Add(permanentMovement);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPermanentMovement", new { id = permanentMovement.ID }, permanentMovement);
        }

        // DELETE: api/PermanentMovements/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePermanentMovement(Guid id)
        {
            var userId = GetUserID();
            if (userId == null)
            {
                return Unauthorized();
            }
            if (_context.PermanentMovements == null)
            {
                return NotFound();
            }

            var permanentMovement = await _context.PermanentMovements.FindAsync(id);
            if (permanentMovement == null)
            {
                return NotFound();
            }

            if (userId != permanentMovement.UserID)
            {
                return Unauthorized();
            }

            _context.PermanentMovements.Remove(permanentMovement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PermanentMovementExists(Guid id)
        {
            return (_context.PermanentMovements?.Any(e => e.ID == id)).GetValueOrDefault();
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