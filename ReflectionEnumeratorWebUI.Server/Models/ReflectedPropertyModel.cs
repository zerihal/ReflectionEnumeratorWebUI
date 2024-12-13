using ReflectionEnumerator.Interfaces;

namespace ReflectionEnumeratorWebUI.Server.Models
{
    public class ReflectedPropertyModel : ReflectedElementModel
    {
        public string PropertyType { get; }

        public string Access { get; }

        public ReflectedPropertyModel(IReflectedProperty property) : base(ElementType.Field, property)
        {
            PropertyType = property.PropertyType;
            Access = property.HasSetter ? property.PublicSetter ? "Get/Set" : "Get/Set (non-public setter)" : "Get";
        }
    }
}
