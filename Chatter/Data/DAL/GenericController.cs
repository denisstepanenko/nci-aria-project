using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Chatter.Data.Models;

namespace Chatter.Data.DAL
{
    public class GenericController
    {
        public GenericController()
        {
            DbContext = new ConceptualModelContainer();
        }

        protected ConceptualModelContainer DbContext;

        
    }
}