using System;
using System.Collections.Generic;

namespace ASP_NET_Core.Models;

public static class SampleData {
    public static List<Sale> Sales { get; } = Generate();

    private static List<Sale> Generate() {
        string[] products = { "Eco Supreme", "Eco Max", "SolarMax", "SolarOne", "EnviroCare" };
        string[] regions = { "North America", "Europe", "Asia", "Africa", "Australia", "South America" };
        string[] sectors = { "Health", "Manufacturing", "Telecom", "Banking", "Insurance" };
        string[] channels = { "VARs", "Consultants", "Direct", "Resellers" };
        string[] customers = {
            "Health Plus Inc", "Renewable Supplies", "System Integrators",
            "Discovery Systems", "Environment Solar", "Johnson & Assoc",
            "Supply Warehous", "Gemini Stores", "Columbia Solar",
            "Arthur & Sons", "Market Eco", "Apollo Inc",
        };

        var rng = new Random(42);
        var baseDate = new DateTime(2024, 1, 1);
        var list = new List<Sale>(200);

        for(var i = 1; i <= 200; i++) {
            list.Add(new Sale {
                Id = i,
                Product = products[rng.Next(products.Length)],
                Amount = rng.Next(10, 100) * 100,
                Discount = Math.Round((decimal)(rng.NextDouble() * 0.4), 4),
                SaleDate = baseDate.AddDays(rng.Next(0, 365)),
                Region = regions[rng.Next(regions.Length)],
                Sector = sectors[rng.Next(sectors.Length)],
                Channel = channels[rng.Next(channels.Length)],
                Customer = customers[rng.Next(customers.Length)],
            });
        }

        return list;
    }
}
