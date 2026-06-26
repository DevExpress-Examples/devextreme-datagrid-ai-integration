using System;
using System.ClientModel;
using ASP_NET_Core.Configuration;
using Azure.AI.OpenAI;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace ASP_NET_Core;
public class Program {
    public static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);

        // Azure OpenAI options
        builder.Services
            .AddOptions<AzureOpenAIOptions>()
            .Bind(builder.Configuration.GetSection(AzureOpenAIOptions.SectionName))
            .ValidateOnStart();

        // Azure OpenAI chat client
        builder.Services.AddSingleton<IChatClient>(sp => {
            var opts = sp.GetRequiredService<IOptions<AzureOpenAIOptions>>().Value;
            var client = new AzureOpenAIClient(new Uri(opts.Endpoint), new ApiKeyCredential(opts.ApiKey));
            return client.GetChatClient(opts.ModelName).AsIChatClient();
        });

        // Add services to the container.
        builder.Services
            .AddControllersWithViews()
            .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if(app.Environment.IsDevelopment()) {
            app.UseDeveloperExceptionPage();
        } else {
            app.UseExceptionHandler("/Home/Error");
        }

        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthorization();

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}"
        );

        app.Run();
    }
}
