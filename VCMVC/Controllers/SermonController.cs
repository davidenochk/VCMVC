using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using FireSharp;
using FireSharp.Config;
using FireSharp.Response;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;

namespace VCMVC.Controllers
{
    public class SermonController : Controller
    {

        IFirebaseConfig config = new FirebaseConfig
        {
            AuthSecret = "",
            BasePath = "https://demovc3.firebaseio.com/"
        };
        // GET: Sermon
        public ActionResult Sermon(string id)
        {

            FirebaseClient client = new FirebaseClient(config);
            var response = client.Get("/sermons");
            var json = JsonConvert.DeserializeObject(response.Body);
            var sermon = new Sermon();
            JToken selectedSermon = null;
            foreach (JToken item in ((JToken)(json)).Children())
            {
                var prop = ((JToken)(JsonConvert.DeserializeObject(((JProperty)(item)).Value.ToString()))).Children();
                foreach (var obj in prop)
                {
                    var ser = (JProperty)(obj);
                    if (ser.Name == "ID" && ser.Value.ToString() == id)
                    {
                        selectedSermon = item;
                    }
                }
            }
            var property = ((JToken)(JsonConvert.DeserializeObject(((JProperty)(selectedSermon)).Value.ToString()))).Children();
            foreach (var obj in property)
            {
                var ser = (JProperty)(obj);
                if (ser.Name == "Name")
                {
                    sermon.Name = ser.Value.ToString();
                }
                else if (ser.Name == "About")
                {
                    var tag = HTMLTagStripper.StripTagsCharArray(ser.Value.ToString());
                    sermon.About = tag;
                }
                else if (ser.Name == "ID")
                {
                    sermon.ID = ser.Value.ToString();
                }
                else if (ser.Name == "Art")
                {
                    sermon.Art = ser.Value.ToString();
                }
                else if (ser.Name == "SmallArt")
                {
                    sermon.SmallArt = ser.Value.ToString();
                }
                else if (ser.Name == "Audio")
                {
                    sermon.Audio = ser.Value.ToString();
                }
            }
            this.ViewData.Add("ID", sermon.ID);
            this.ViewData.Add("name", sermon.Name);
            this.ViewData.Add("content", sermon.About);
            this.ViewData.Add("art", sermon.Art);
            this.ViewData.Add("smallArt", sermon.SmallArt);
            this.ViewData.Add("audio", sermon.Audio);
            return View();
        }
    }

    public class Sermon
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public string About { get; set; }
        public string Art { get; set; }
        public string SmallArt { get; set; }
        public string Audio { get; set; }
    }
}