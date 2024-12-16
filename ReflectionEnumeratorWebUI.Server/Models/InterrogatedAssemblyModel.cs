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

                // ToDo - If assembly object is not reflected and there is an error with HasEntryPoint as true,
                // we may still be able to get the info, however this should be placed into a try catch ...
            }
        }

        public override string ToString() => $"{Name} (Version: {Version})";
    }
}
