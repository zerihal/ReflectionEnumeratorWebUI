using Microsoft.AspNetCore.Mvc;
using ReflectionEnumerator;
using ReflectionEnumerator.Interfaces;
using ReflectionEnumerator.Settings;
using ReflectionEnumeratorWebUI.Server.Models;
using System.Reflection;

namespace ReflectionEnumeratorWebUI.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReflectorEnumeratorController : ControllerBase
    {
        // ToDo: Other than logger, should these be static objects here or should they be passed in?
        private static IReflectorSettings _settings = new ReflectorSettings(ReflectorModifiers.All);
        private static Interrogator _interrogator = new Interrogator(_settings);
        private readonly ILogger<ReflectorEnumeratorController> _logger;

        public ReflectorEnumeratorController(ILogger<ReflectorEnumeratorController> logger)
        {
            _logger = logger;
        }

        [HttpGet("test")]
        public async Task<IActionResult> GetTest()
        {
            await Task.CompletedTask;
            return Ok(new { Message = "Test was OK" });
        }

        [HttpPost("reflect-assembly")]
        public async Task<IActionResult> ReflectAssembly(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is null or empty.");

            if (!file.FileName.EndsWith(".dll", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Only DLL files are allowed.");

            try
            {
                // Load the DLL into a byte array
                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                var assemblyBytes = memoryStream.ToArray();

                // Load the assembly
                Assembly assembly = Assembly.Load(assemblyBytes);

                Console.WriteLine($"Processing assembly: {assembly.GetName().Name}");

                // Reflect and enumerate the assembly
                var interrogatedAssembly = _interrogator.InterrogateAssembly(assembly);

                if (interrogatedAssembly != null)
                {
                    // Populate assembly objects
                    await interrogatedAssembly.GetAssemblyObjectElementsAsync();

                    if (interrogatedAssembly.AssemblyObjects.Any())
                    {
                        // Create models for the reflected assembly and return the root object
                        var interrogatedAssemblyModel = new InterrogatedAssemblyModel(interrogatedAssembly);
                        return Ok(interrogatedAssemblyModel);
                    }
                }
            }
            catch (BadImageFormatException ex)
            {
                return StatusCode(400, $"Invalid assembly format: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return StatusCode(400, "No data");
        }
    }
}
