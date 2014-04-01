using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Chatter.Data.Models;
using Chatter.Data.DAL;

namespace Chatter.API.Controllers
{
    public class Default1Controller : ApiController
    {
        private ConceptualModelContainer db = new ConceptualModelContainer();
        private GenericController controller = new GenericController();
        
        // GET api/Default1
        public IQueryable<Table1> GetTable1()
        {
            return controller.GetTable1Data();
        }

        // GET api/Default1/5
        [ResponseType(typeof(Table1))]
        public IHttpActionResult GetTable1(int id)
        {
            Table1 table1 = db.Table1.Find(id);
            if (table1 == null)
            {
                return NotFound();
            }

            return Ok(table1);
        }

        // PUT api/Default1/5
        public IHttpActionResult PutTable1(int id, Table1 table1)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != table1.Id)
            {
                return BadRequest();
            }

            db.Entry(table1).State = System.Data.Entity.EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Table1Exists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Default1
        [ResponseType(typeof(Table1))]
        public IHttpActionResult PostTable1(Table1 table1)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Table1.Add(table1);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (Table1Exists(table1.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = table1.Id }, table1);
        }

        // DELETE api/Default1/5
        [ResponseType(typeof(Table1))]
        public IHttpActionResult DeleteTable1(int id)
        {
            Table1 table1 = db.Table1.Find(id);
            if (table1 == null)
            {
                return NotFound();
            }

            db.Table1.Remove(table1);
            db.SaveChanges();

            return Ok(table1);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Table1Exists(int id)
        {
            return db.Table1.Count(e => e.Id == id) > 0;
        }
    }
}