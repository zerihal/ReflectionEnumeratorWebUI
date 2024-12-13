using ReflectionEnumerator.Interfaces;

namespace ReflectionEnumeratorWebUI.Server.Models
{
    public class ReflectedEventModel : ReflectedElementModel
    {
        public ReflectedEventModel(IReflectedEvent reflectedEvent) : base(ElementType.Event, reflectedEvent)
        {
        }
    }
}
