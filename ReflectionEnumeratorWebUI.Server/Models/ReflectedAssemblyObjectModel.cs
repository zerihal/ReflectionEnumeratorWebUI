using ReflectionEnumerator.Interfaces;

namespace ReflectionEnumeratorWebUI.Server.Models
{
    public class ReflectedAssemblyObjectModel
    {
        public ObjectType AssemblyObjectType { get; }

        public string Name { get; }

        public string AccessModifier { get; }

        public List<ReflectedPropertyModel> Properties { get; }

        public List<ReflectedMethodModel> Methods { get; }

        public List<ReflectedFieldModel> Fields { get; }

        public List<ReflectedEventModel> Events { get; }

        public ReflectedAssemblyObjectModel(IAssemblyObject reflectedAssemblyObject)
        {
            Name = reflectedAssemblyObject.Name;
            AssemblyObjectType = (ObjectType)reflectedAssemblyObject.ObjectType;
            AccessModifier = reflectedAssemblyObject.AccessModifer;

            Properties = new List<ReflectedPropertyModel>();
            Methods = new List<ReflectedMethodModel>();
            Fields = new List<ReflectedFieldModel>();
            Events = new List<ReflectedEventModel>();

            CreateModels(reflectedAssemblyObject);

            //Properties = _reflectedAssembly.Properties.Select(p => p.Name).ToArray();
            //Methods = _reflectedAssembly.Methods.Select(m => m.Name).ToArray();
            //Fields = _reflectedAssembly.Fields.Select(f => f.Name).ToArray();
            //Events = _reflectedAssembly.Events.Select(f => f.Name).ToArray();
        }

        private void CreateModels(IAssemblyObject assemblyObject)
        {
            foreach (var prop in assemblyObject.Properties)
                Properties.Add(new ReflectedPropertyModel(prop));

            foreach (var method in assemblyObject.Methods)
                Methods.Add(new ReflectedMethodModel(method));

            foreach (var field in assemblyObject.Fields)
                Fields.Add(new ReflectedFieldModel(field));

            foreach (var reflectedEvent in assemblyObject.Events)
                Events.Add(new ReflectedEventModel(reflectedEvent));
        }

        public override string ToString() => Name;
    }
}
