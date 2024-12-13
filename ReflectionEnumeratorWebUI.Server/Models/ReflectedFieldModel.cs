using ReflectionEnumerator.Interfaces;

namespace ReflectionEnumeratorWebUI.Server.Models
{
    public class ReflectedFieldModel : ReflectedElementModel
    {
        public string FieldType { get; }

        public ReflectedFieldModel(IReflectedField field) : base(ElementType.Field, field)
        {
            FieldType = field.FieldType;
        }
    }
}
