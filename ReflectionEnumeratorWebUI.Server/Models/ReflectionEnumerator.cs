using ReflectionEnumerator.Interfaces;

namespace ReflectionEnumeratorWebUI.Server.Models
{
    public class ReflectionEnumerator
    {
        /// <summary>
        /// 
        /// </summary>
        public IInterrogatedAssembly? InterrogatedAssembly { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public IReflectorSettings? Settings { get; set; }
    }
}
