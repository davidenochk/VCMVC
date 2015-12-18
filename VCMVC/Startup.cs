using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(VCMVC.Startup))]
namespace VCMVC
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //ConfigureAuth(app);
        }
    }
}
