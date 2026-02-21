export default function Acknowledgements() {
  const inspirations = [
    {
      name: "vallode",
      description: "For creating my own site that has the data set",
      link: "mhfu.vallode.com",
      //   https://github.com/vallode/mhfu-blacksmith
    },
    {
      name: "MapGenie",
      description:
        "For creating my own viewable with pins and easy searchable resource map.",
      link: "https://mapgenie.io/",
    },
    // Add more inspirations as needed
  ];

  const dataSources = [
    {
      name: "vallode",
      description:
        "Data set used: content/decorations/decorations-crafting.json",

      //   decorations - https://github.com/vallode/mhfu-blacksmith/blob/750758793e09ce55bb961f13767e838d1710925b/content/decorations/decorations-crafting.json
      /*
  armors 
https://github.com/vallode/mhfu-blacksmith/tree/750758793e09ce55bb961f13767e838d1710925b/content/armorsmith

weapons
https://github.com/vallode/mhfu-blacksmith/tree/750758793e09ce55bb961f13767e838d1710925b/content/blacksmith

decorations
https://github.com/vallode/mhfu-blacksmith/tree/750758793e09ce55bb961f13767e838d1710925b/content/decorations

monsters 
https://github.com/vallode/mhfu-blacksmith/tree/750758793e09ce55bb961f13767e838d1710925b/content/monsters
*/
      link: "mhfu.vallode.com",
    },
    {
      name: "Monster Hunter Wiki",
      description: "For the item list",
      link: "https://monsterhunter.fandom.com/wiki/MHFU:_Item_List",
    },
    {
      name: "ryin77",
      description: "For the resource maps and armor skills",
      // maps -  https://gamefaqs.gamespot.com/psp/943356-monster-hunter-freedom-unite/faqs/78652/resource-maps
      //   armor skills - https://gamefaqs.gamespot.com/psp/943356-monster-hunter-freedom-unite/faqs/78652/armor-skills
      link: "https://gamefaqs.gamespot.com/psp/943356-monster-hunter-freedom-unite/faqs/78652/resource-maps",
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#E9D3B4]">
      <section
        aria-labelledby="acknowledgements-title"
        className="w-full py-16 sm:py-20 shadow-md text-center bg-[#6B3E1B]"
      >
        <h1
          id="acknowledgements-title"
          className="uppercase font-extrabold tracking-widest leading-tight text-[#F7E7D0] text-[clamp(2rem,5vw,3.5rem)]"
        >
          ACKNOWLEDGEMENTS
        </h1>
      </section>

      {/* CONTENT (full-width flesh) */}
      <section className="w-full py-12 px-6 sm:px-12 shadow-inner bg-[#E9D3B4]">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-[#5A3F28]">
            Inspirations
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-[#5A3F28]">
            This project was inspired by various sources and individuals. Add
            your acknowledgements here.
          </p>
          <ul className="list-disc list-inside mb-8 space-y-2 text-[#5A3F28]">
            {inspirations.map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="underline hover:no-underline text-[#6B3E1B]"
                >
                  {item.name}
                </a>{" "}
                - {item.description}
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6 text-[#5A3F28]">
            Data Sources
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-[#5A3F28]">
            Data was extracted from various sources. Acknowledge them here.
          </p>
          <ul className="list-disc list-inside mb-8 space-y-2 text-[#5A3F28]">
            {dataSources.map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="underline hover:no-underline text-[#6B3E1B]"
                >
                  {item.name}
                </a>{" "}
                - {item.description}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
