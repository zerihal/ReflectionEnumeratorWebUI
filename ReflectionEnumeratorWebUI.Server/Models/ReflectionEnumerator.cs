using ReflectionEnumerator.Interfaces;

namespace ReflectionEnumeratorWebUI.Server.Models
{
    // ToDo: Maybe delete this?
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
