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
                {
                    AssemblyObjects.Add(new ReflectedAssemblyObjectModel(assemblyObject));
                }
                else if (interrogatedAssembly.AssemblyReflectionError != null && interrogatedAssembly.HasEntryPoint)
                {
                    // If assembly object is not reflected but the assembly itself had a reflection error with
                    // an entry point present then this may be a renamed or exe dll, in which case it may still 
                    // be possible to get some assembly objects, however this should be done in a try/catch

                    try
                    {
                        AssemblyObjects.Add(new ReflectedAssemblyObjectModel(assemblyObject));
                    }
                    catch
                    {
                        // Swallow the exception
                    }
                }
            }
        }

        public override string ToString() => $"{Name} (Version: {Version})";
    }
}
