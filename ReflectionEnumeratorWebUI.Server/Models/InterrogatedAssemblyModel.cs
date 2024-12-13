using ReflectionEnumerator.Interfaces;

namespace ReflectionEnumeratorWebUI.Server.Models
{
    public class InterrogatedAssemblyModel
    {
        public string Name { get; }

        public string Version { get; }

        public List<ReflectedAssemblyObjectModel> AssemblyObjects { get; }

        public InterrogatedAssemblyModel(IInterrogatedAssembly interrogatedAssembly)
        {
            Name = interrogatedAssembly.Name;
            Version = interrogatedAssembly.Version.ToString();

            AssemblyObjects = new List<ReflectedAssemblyObjectModel>();

            foreach (var assemblyObject in interrogatedAssembly.AssemblyObjects)
            {
                if (assemblyObject.IsReflected)
                    AssemblyObjects.Add(new ReflectedAssemblyObjectModel(assemblyObject));
            }
        }
    }
}
