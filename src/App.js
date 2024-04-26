import "./App.css";

import { setup } from "@loomhq/record-sdk";
import { oembed } from "@loomhq/loom-embed";
import { useEffect, useState } from "react";
import { isSupported } from "@loomhq/record-sdk/is-supported";
import * as jose from "jose";

// const PUBLIC_APP_ID = "865a41dd-32c0-48dc-b4b8-f9fc0ab13f61";
const PUBLIC_APP_ID = "865a41dd-32c0-48dc-b4b8-f9fc0ab13f61";
const BUTTON_ID = "loom-record-sdk-button";

function App() {
  const [videoHTML, setVideoHTML] = useState("");

  useEffect(() => {
    async function setupLoom() {
      const { supported, error } = await isSupported();

      if (!supported) {
        console.warn(`Error setting up Loom: ${error}`);
        return;
      }

      const pk = await jose.importPKCS8('-----BEGIN PRIVATE KEY----- MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGyXLm8vSlkDuw W8nLESYdh4BKJfAaOjpdNRVE8cU85W8liRvX5+vhsMj+VtBuV+sp9wEk+hlMgytt T7jMdVAK3QKbLk8epsknqOhX6yQCAO2exgbP4nXwAalJb1a+fHfWFXbQnmT8SzEO tNxB+cvXqepeGsQXROKQoIYnx3VMx2jN3s8i5kX0uU2OcBuwCg8QJDb5OeIAeolr k6doY2lE2pJmABW6Vfn4zn/atjKOtRDiapEIMZ4P6o0vTImyui770Ey9z2eZCrUT liuzYb8eOpsPK9D+Z35AUFeYIdN5+Ie4cfQkZoZnYFWbPQow9oZGbJw8JkLBgNgr fTheWXLZAgMBAAECggEAAVJkW1UKVldWJZscpXHUH4OPxrPHy+gvIcDJPGEWWyGZ mpCAdlrI/UzqGefc9l41tqdunbl0hYcvQ3MxjZl/mmI5GCv9CR1Z49O/lMXADUEx PfpU4APCXex9kiWQLaTWp/5SoOVBaGc9w0+6/GIoo6Lc0jqfwG8GtH2+xUuyHobc whffZ4ssnUriTxj4GVirbHyo+VXx04s1glL0KnpMvjuGTKzzqKeM4RQAlz/oEKkX xBFKSKiwx1XoxPKLq8C8LO/OM9tI9vJpo1MoiqHX3JdvYB2NRP9++aYCi87YVkw0 8U4qCrUTM7iIlfMplbf/oGfcI5zdHHsw8DpLlemsoQKBgQDvDILAYX9Z1SsOKS4/ XH+ukdt/SgaxYEts8//msBVoCUVOAulnfsrUiCjm4jnMXiyg0niZvDT+/0LzZe3f PMxH8dPx+t/YER5hpX7pu2gEwzhtk1WmgNhCT8GQk6nPL3KM8C/ZKdn3+1ZVeYtc pPUJeRM9kMxfzFDnYpN/+HTCYQKBgQDU4g6KtG6jM+WFMF8XsUAN6lj+LeOrHPHQ veVD+pUzHxT9xu12JLTb4tN3GA/uHgiqH9Jt/Sm4I13jpJ3qx+6UuK+WdmFoeh32 n1W6E1voKjlLMWv024pOPJcuUURC9w6dAWvtepcu9gvT1r98nVwRblCOcGj0c6Bu 1m8ButhzeQKBgQDE19p7LE2/3Wb83DA3AKYrS/QhFwX33cF+UFXy0iBucOPe30rv bFr9M7nqlXLetNWvAGFKxs4lBHFPGCoOX3Qf8iSC6ACXXVFVOwAM28NF2LOIl4A6 AXMS97X+pXl5ICsFn2rnOi1ApHhtHg8CFNuqF0cetTN11zrvrh6jjCYpQQKBgDpe VOBhAmjLBOZU0e3cEpT+KTJgAKldAUxblK3j2d6vagD+9wLKo7AabCKePVfrcjK7 EOZJYJP1VnvhGc9SzC6IyNP3V1PfD7IcE9Q2FJ/+W8ErJs93Fl/HKyhu7clyldYk mqP9VdBxc+K8YbpYJvM8jOfRGGXWAioBr2QJB+n5AoGABNU9YRhvHMRv23vMpxLb YQ5uk9Jta9rB66xxlOnIffSBShQ7AJZ+aE8GNDs+VbCAUyMN0x1gPiYitAZlOe+Q zJJeu9gmGwoQlADoosiQljv9kp3kx7+qZFR3/kb4o4D4DCZ7wFWMOgP+CqMEl8ox /buBOElE+rPpRzu4FvCUwMo= -----END PRIVATE KEY-----', "RS256");
      
      let jws = await new jose.SignJWT({})
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(PUBLIC_APP_ID)
        .setExpirationTime("20s")
        .sign(pk);

      const button = document.getElementById(BUTTON_ID);

      if (!button) {
        return;
      }

      const { configureButton } = await setup({
        jws: jws,
        // publicAppId: PUBLIC_APP_ID,
      });

      const sdkButton = configureButton({ element: button });

      sdkButton.on("insert-click", async (video) => {
        const { html } = await oembed(video.sharedUrl, { width: 400 });
        setVideoHTML(html);
      });
    }

    setupLoom();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <button id={BUTTON_ID}>Record</button>
        <div dangerouslySetInnerHTML={{ __html: videoHTML }}></div>
      </header>
    </div>
  );
}

export default App;
