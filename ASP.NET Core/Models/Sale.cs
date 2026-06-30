using System;

namespace ASP_NET_Core.Models;

public class Sale {
    public int Id { get; set; }
    public string Product { get; set; }
    public decimal Amount { get; set; }
    public decimal Discount { get; set; }
    public DateTime SaleDate { get; set; }
    public string Region { get; set; }
    public string Sector { get; set; }
    public string Channel { get; set; }
    public string Customer { get; set; }
}
