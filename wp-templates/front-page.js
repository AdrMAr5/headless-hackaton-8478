import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import style from "../styles/front-page.module.css";
import { SITE_DATA_QUERY } from "../queries/SiteSettingsQuery";
import { HEADER_MENU_QUERY } from "../queries/MenuQueries";
import { useQuery } from "@apollo/client";
import { getNextStaticProps } from "@faustwp/core";

const regions = [
  {
    name: "Donegal",
    description: "Experience the rugged, remote beauty of the Northern Headlands, from Malin Head to the Slieve League Cliffs.",
    link: "/regions/donegal/",
  },
  {
    name: "Sligo & Mayo",
    description: "Discover a land of myth and legend, with dramatic mountains, serene lakes, and the wild surf of the Atlantic.",
    link: "/regions/sligo-mayo/",
  },
  {
    name: "Galway & Clare",
    description: "From the vibrant city of Galway to the lunar landscape of the Burren and the iconic Cliffs of Moher.",
    link: "/regions/galway-clare/",
  },
  {
    name: "Kerry",
    description: "Home to the famous Ring of Kerry and the stunning Dingle Peninsula, a place of breathtaking coastal scenery.",
    link: "/regions/kerry/",
  },
  {
    name: "West Cork",
    description: "Explore the charming villages, hidden coves, and artisanal food scene of the Southern Peninsulas.",
    link: "/regions/west-cork/",
  },
];

export default function FrontPage(props) {
  if (props.loading) {
    return <>Loading...</>;
  }

  const headerMenuDataQuery = useQuery(HEADER_MENU_QUERY) || {};
  const menuItems = headerMenuDataQuery?.data?.primaryMenuItems?.nodes || [];
  
  const siteTitle = "The Wild Atlantic Way";
  const siteDescription = "Discover the magic of Ireland's rugged west coast.";

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Header
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        menuItems={menuItems}
      />

      <main>
        <div className={style.hero}>
          <div className="container">
            <h1 className={style.heroTitle}>Where land and sea collide.</h1>
            <p className={style.heroSubtitle}>
              Embark on a spectacular journey along 2,500km of Ireland's dramatic western coastline.
            </p>
          </div>
        </div>

        <div className="container">
          <section className={style.introSection}>
            <h2>A Journey Through the Heart of Ireland</h2>
            <p>
              The Wild Atlantic Way is a route that showcases the raw power and captivating beauty of the Atlantic Ocean as it meets the Irish shore. From the wild landscapes of Donegal to the quaint fishing villages of Cork, every twist and turn of the road reveals a new vista to take your breath away. This is more than a drive; it's an adventure into the heart of Irish culture, nature, and magic.
            </p>
          </section>

          <section className={style.regionsSection}>
            <h2>Explore the Regions</h2>
            <div className={style.cardGrid}>
              {regions.map((region) => (
                <Link href={region.link} key={region.name} className={style.card}>
                  <h3>{region.name} →</h3>
                  <p>{region.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page: FrontPage,
    revalidate: 60,
  });
}

FrontPage.queries = [
  {
    query: SITE_DATA_QUERY,
  },
  {
    query: HEADER_MENU_QUERY,
  },
];