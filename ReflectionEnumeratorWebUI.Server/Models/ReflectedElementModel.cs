using ReflectionEnumerator.Interfaces;

namespace ReflectionEnumeratorWebUI.Server.Models
{
    public abstract class ReflectedElementModel
    {
        public ElementType ElementType { get; }
        public string Name { get; }
        public bool IsPublic { get; }

        public ReflectedElementModel(ElementType elementType, IReflectedElement element)
        {
            ElementType = elementType;
            Name= element.Name;
            IsPublic = !element.NonPublic;
        }
    }
}
