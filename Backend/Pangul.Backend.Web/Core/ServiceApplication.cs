using System;
using System.IO.Abstractions;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NCore.Base.Commands.Conventions;
using NCore.Base.Log;
using NLog;
using Pangul.Backend.Web.Configuration.Authentication;
using Pangul.Backend.Web.Configuration.Settings;
using Pangul.Backend.Web.Infrastructure.Middleware;
using Pangul.Services;
using Pangul.Services.Concrete;
using Pangul.Services.Services;
using Pangul.Services.Services.Auth;
using IContainer = Autofac.IContainer;

namespace Pangul.Backend.Web.Core
{
  public class ServiceApplication
  {
    private const string ServiceMatchExpression = "Pangul\\.Core\\..*";

    private IContainer _container;

    public IServiceProvider ConfigureServices(IServiceCollection services)
    {
      // Configure logging
      new LogService().ConfigureLogging(new ServiceLogging());
      services.AddSingleton<ILoggerFactory>((_) => new ServiceLoggerFactory());

      // Register assemblies for discovery
      ConcreteServices.RegisterAssemblyForDiscovery();

      // Load services by convention
      var builder = new ContainerBuilder();
      var config = new ServiceDependencies(builder);
      new PangulServiceConventions().RegisterAll(config, config);
      new ServiceLocalDependencies().RegisterAll(config, config);
      new ServiceLocator(ServiceMatchExpression).RegisterAllByConvention(builder);

      // 3rd-party
      builder.RegisterType<FileSystem>().AsImplementedInterfaces();

      // Load asp.net core services
      services.AddRouting();
      services.AddControllers()
          .AddFluentValidation()
          .AddNewtonsoftJson();

      new ServiceExtensions()
        .AddCors(services)
        .AddGlobalExceptionHandler(services);

      // Configure web auth
      var authService = new ServicePolicyList().AddAuthorization(services);
      services.AddSingleton(authService);

      // Convert to autofac
      builder.Populate(services);
      _container = builder.Build();

      // Configure pangul auth
      var authBuilder = _container.Resolve<IPangulAuthServiceBuilder>();
      var userService = _container.Resolve<IUserService>();
      authBuilder.ConfigureProvider(new ServiceIdentityList(userService));
      authBuilder.Build(_container.Resolve<IPangulAuthService>());

      // Bind autofac as service provider
      return new AutofacServiceProvider(_container);
    }

    public void ConfigureApplication(IApplicationBuilder app)
    {
      // Load settings
      var settings = new ServiceSettings();
      
      app.UseAuthentication();
      app.UseRouting();
      app.UseAuthorization();
      app.UseCors(ServiceExtensions.PangulCorsPolicy);
      app.UseEndpoints(endpoints =>
      {
          endpoints.MapControllerRoute("default", "{controller=Frontend}/{action=Index}/{id?}");
      });
      app.UseMiddleware<PangulSpaMiddleware>(new PangulSpaMiddlewareOptions()
      {
        StaticFolderRoots = new []
        {
          settings.Folders.StaticAssetsFolder,
          settings.Folders.StaticAssetsFallbackFolder,
        },
        IgnoreRoutes = new [] { "/api" },
        DefaultPath = "/index.html"
      });

      // If we don't have a database, create it now
      ServiceDb.CreateAndMigrateDatabaseIfMissing();      
      
      var logger = LogManager.GetCurrentClassLogger();
      logger.Info("Application started");
    }
  }
}