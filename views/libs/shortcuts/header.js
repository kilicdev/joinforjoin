module.exports = function(client, csybot, path) {
  let location = path
    .replaceAll("index.ejs", "Dashboard")
    .replaceAll("server.ejs", "Profile")
    .replaceAll("error.ejs", "Error")
  
  var header = "";

  if (
    location == "Dashboard" ||
    location == "Profile"
  ) {
    header = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet" />
    <link rel="stylesheet" href="https://api.csycraft.com/libs/css/panel.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
    <meta name="twitter:card" value="summary">
    <meta name="twitter:title" content="${csybot.config.name} - Dashboard">
    <meta name="twitter:description" content="${csybot.config.description}">
    <meta name="twitter:image" content="${csybot.config.panel}/images/logo.png">
    <meta name="title" content="${csybot.config.name} - Dashboard">
    <meta name="description" content="${csybot.config.description}">
    <meta name="keywords" content="${csybot.config.keywords
      .map(x => x)
      .join(", ")}">
    <meta name="image" content="${csybot.config.panel}/images/logo.png">
    <meta itemprop="image" content="${csybot.config.panel}/images/logo.png"  />
    <meta http-equiv="Content-Type" content="text/html; charset=utf8">
    <meta name="revisit-after" content="1 days">
    <meta name="google" content="notranslate" />
    
    <link rel="icon" href="${csybot.config.panel}/images/logo.png">
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6804591694961902"
    crossorigin="anonymous"></script>
    
    <title>${csybot.config.name} - ${location}</title>
  `;
  } else if (location == "Home") {
    header = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <meta name="twitter:card" value="summary">
    <meta name="twitter:title" content="${csybot.config.name} - Hub">
    <meta name="twitter:description" content="${csybot.config.description}">
    <meta name="twitter:image" content="${csybot.config.panel}/images/logo.png">
    <meta name="title" content="${csybot.config.name} - Hub">
    <meta name="description" content="${csybot.config.description}">
    <meta name="keywords" content="${csybot.config.keywords
      .map(x => x)
      .join(", ")}">
    <meta name="image" content="${csybot.config.panel}/images/logo.png">
    <meta itemprop="image" content="${csybot.config.panel}/images/logo.png"  />
    <meta http-equiv="Content-Type" content="text/html; charset=utf8">
    <meta name="revisit-after" content="1 days">
    <meta name="google" content="notranslate" />
    
    <link rel="stylesheet" href="https://api.csycraft.com/libs/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://api.csycraft.com/libs/css/main.css?v=0.0.1">
    <link rel="stylesheet" href="https://api.csycraft.com/libs/css/global.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,600,700,800,900&display=swap" rel="stylesheet">
    <link rel="icon" href="${csybot.config.panel}/images/logo.png">
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6804591694961902"
    crossorigin="anonymous"></script>
    
    <title>${csybot.config.name} - ${location}</title>
  `;
  } else if (location == "Error") {
    header = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <meta name="twitter:card" value="summary">
    <meta name="twitter:title" content="${csybot.config.name} - Error">
    <meta name="twitter:description" content="${csybot.config.description}">
    <meta name="twitter:image" content="${csybot.config.panel}/images/logo.png">
    <meta name="title" content="${csybot.config.name} - Error">
    <meta name="description" content="${csybot.config.description}">
    <meta name="keywords" content="${csybot.config.keywords
      .map(x => x)
      .join(", ")}">
    <meta name="image" content="${csybot.config.panel}/images/logo.png">
    <meta itemprop="image" content="${csybot.config.panel}/images/logo.png"  />
    <meta http-equiv="Content-Type" content="text/html; charset=utf8">
    <meta name="revisit-after" content="1 days">
    <meta name="google" content="notranslate" />
    
    <link rel="stylesheet" href="https://api.csycraft.com/libs/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://api.csycraft.com/libs/css/main.css?v=0.0.1">
    <link rel="stylesheet" href="https://api.csycraft.com/libs/css/global.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,600,700,800,900&display=swap" rel="stylesheet">
    <link rel="icon" href="${csybot.config.panel}/images/logo.png">
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6804591694961902"
    crossorigin="anonymous"></script>
    
    <title>${csybot.config.name} - ${location}</title>
  `;
  } else {
    header = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <meta name="twitter:card" value="summary">
    <meta name="twitter:title" content="${csybot.config.name} - ${location}">
    <meta name="twitter:description" content="${csybot.config.description}">
    <meta name="twitter:image" content="${csybot.config.panel}/images/logo.png">
    <meta name="title" content="${csybot.config.name} - ${location}">
    <meta name="description" content="${csybot.config.description}">
    <meta name="keywords" content="${csybot.config.keywords
      .map(x => x)
      .join(", ")}">
    <meta name="image" content="${csybot.config.panel}/images/logo.png">
    <meta itemprop="image" content="${csybot.config.panel}/images/logo.png"  />
    <meta http-equiv="Content-Type" content="text/html; charset=utf8">
    <meta name="revisit-after" content="1 days">
    <meta name="google" content="notranslate" />
    
    ${(location != "Terms" && location != "Privacy") ? `<link rel="stylesheet" href="https://api.csycraft.com/libs/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://api.csycraft.com/libs/css/main.css?v=0.0.1">
    <link rel="stylesheet" href="https://api.csycraft.com/libs/css/global.css">` : ""}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,600,700,800,900&display=swap" rel="stylesheet">
    <link rel="icon" href="${csybot.config.panel}/images/logo.png">
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6804591694961902"
    crossorigin="anonymous"></script>
    
    <title>${csybot.config.name} - ${location}</title>
  `;
  }

  return header + require("./loader.js")(csybot, location);
} 