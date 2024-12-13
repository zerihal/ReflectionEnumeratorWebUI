using ReflectionEnumerator.Interfaces;

namespace ReflectionEnumeratorWebUI.Server.Models
{
    public class ReflectedMethodModel : ReflectedElementModel
    {
        public List<string> Args { get; }

        public string ReturnType { get; }

        public ReflectedMethodModel(IReflectedMethod method) : base(ElementType.Field, method)
        {
            ReturnType = method.ReturnType;
            Args = new List<string>();

            foreach (var arg in method.ReflectedArgs)
            {
                var argStr = arg.ArgType;

                if (arg.IsNullable)
                    argStr += "?";

                argStr += $" {arg.ArgName}";

                if (arg.IsOptional && arg.DefaultValue != null)
                    argStr += $" = {GetDefaultValue(arg.DefaultValue)}";

                Args.Add(argStr);
            }
        }

        private string GetDefaultValue(object defaultValObj)
        {
            switch (defaultValObj)
            {
                case string _:
                case bool _:
                    return defaultValObj?.ToString() ?? string.Empty;
                default:
                    if (int.TryParse(defaultValObj.ToString(), out var numVal))
                        return numVal.ToString();
                    return defaultValObj?.GetType().FullName ?? string.Empty;
            }
        }
    }
}
