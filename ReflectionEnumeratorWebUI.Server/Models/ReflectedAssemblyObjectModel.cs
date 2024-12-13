using ReflectionEnumerator.Interfaces;

namespace ReflectionEnumeratorWebUI.Server.Models
{
    public class ReflectedAssemblyObjectModel
    {
        private IAssemblyObject _reflectedAssembly;

        public ObjectType AssemblyObjectType { get; }

        public string Name { get; }

        public string AccessModifier { get; }

        public string[] Properties { get; }

        public string[] Methods { get; }

        public string[] Fields { get; }

        public string[] Events { get; }

        public ReflectedAssemblyObjectModel(IAssemblyObject reflectedAssemblyObject)
        {
            _reflectedAssembly = reflectedAssemblyObject;
            Name = _reflectedAssembly.Name;
            AssemblyObjectType = (ObjectType)_reflectedAssembly.ObjectType;
            AccessModifier = _reflectedAssembly.AccessModifer;

            Properties = _reflectedAssembly.Properties.Select(p => p.Name).ToArray();
            Methods = _reflectedAssembly.Methods.Select(m => m.Name).ToArray();
            Fields = _reflectedAssembly.Fields.Select(f => f.Name).ToArray();
            Events = _reflectedAssembly.Events.Select(f => f.Name).ToArray();
        }

        public ReflectedPropertyModel? GetReflectedProperty(string propertyName)
        {
            if (_reflectedAssembly.Properties.FirstOrDefault(p => p.Name == propertyName) is IReflectedProperty prop)
                return new ReflectedPropertyModel(prop);

            return null;
        }

        public ReflectedMethodModel? GetReflectedMethod(string methodName)
        {
            if (_reflectedAssembly.Methods.FirstOrDefault(m => m.Name == methodName) is IReflectedMethod method)
                return new ReflectedMethodModel(method);

            return null;
        }

        public ReflectedFieldModel? GetReflectedField(string fieldName)
        {
            if (_reflectedAssembly.Fields.FirstOrDefault(f => f.Name == fieldName) is IReflectedField field)
                return new ReflectedFieldModel(field);

            return null;
        }

        public ReflectedEventModel? GetReflectedEvent(string eventName)
        {
            if (_reflectedAssembly.Events.FirstOrDefault(m => m.Name == eventName) is IReflectedEvent reflectedEvent)
                return new ReflectedEventModel(reflectedEvent);

            return null;
        }
    }
}
