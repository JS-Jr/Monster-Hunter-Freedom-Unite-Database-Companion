export default function Acknowledgements() {
  const inspirations = [
    {
      name: "vallode",
      description:
        "I really like this site because it has a great dataset laid out in a tree structure. But, it's missing some essential filtering options, like showing only specific items. This pushed me to kick off my own project because I think I can make the user experience a lot better with the data that's already there.",
      link: "https://mhfu.vallode.com/",
    },
    {
      name: "MapGenie",
      description:
        "MapGenie caught my eye and got me thinking about creating my own version for Monster Hunter Freedom Unite (MHFU). I love how interactive their site is, and it inspires me to build a resource map that's super user-friendly.",
      link: "https://mapgenie.io/",
    },
  ];

  const dataSources = [
    {
      name: "vallode",
      description:
        "Consolidated armor, weapon and monster data set. Used decoration but tranformed it using a python script for my use",
      link: "https://github.com/vallode/mhfu-blacksmith",
      // decorations
      // https://github.com/vallode/mhfu-blacksmith/blob/750758793e09ce55bb961f13767e838d1710925b/content/decorations/decorations-crafting.json

      // armors
      // https://github.com/vallode/mhfu-blacksmith/tree/750758793e09ce55bb961f13767e838d1710925b/content/armorsmith

      // weapons
      // https://github.com/vallode/mhfu-blacksmith/tree/750758793e09ce55bb961f13767e838d1710925b/content/blacksmith

      // decorations
      // https://github.com/vallode/mhfu-blacksmith/tree/750758793e09ce55bb961f13767e838d1710925b/content/decorations

      // monsters
      // https://github.com/vallode/mhfu-blacksmith/tree/750758793e09ce55bb961f13767e838d1710925b/content/monsters
    },
    {
      name: "Monster Hunter Wiki",
      description:
        "Used reference/data for item list and used python script to extract and tranform it to json",
      //   description: "For the item list",
      link: "https://monsterhunter.fandom.com/wiki/MHFU:_Item_List",
    },
    // {
    //   name: "ryin77",
    //   description: "For the resource maps and armor skills",
    //   link: "https://gamefaqs.gamespot.com/psp/943356-monster-hunter-freedom-unite/faqs/78652/resource-maps",
    // },
    {
      name: "ryin77",
      description:
        "Used reference/data for maps and armor skills and used python script to extract and tranform it to json. Used also the images for the amps",
      link: "https://gamefaqs.gamespot.com/psp/943356-monster-hunter-freedom-unite/faqs/78652",
      // maps -  https://gamefaqs.gamespot.com/psp/943356-monster-hunter-freedom-unite/faqs/78652/resource-maps
      // armor skills - https://gamefaqs.gamespot.com/psp/943356-monster-hunter-freedom-unite/faqs/78652/armor-skills
    },
    {
      name: "almarsguides",
      description: "Used data for CWCheats",
      link: "https://www.almarsguides.com/retro/walkthroughs/psp/games/monsterhunterfreedomunite/cwcheat/usa/",
    },
    {
      name: "Kolyn090",
      description: "Used data for quests",
      link: "https://github.com/Kolyn090/mhfu-db/tree/main/Quests",
    },
    // {
    //   name: "monsterhunterwiki",
    //   description: "Used mored data for quests",
    //   link: "https://monsterhunterwiki.org/wiki/MHFU/Quests/Village_Quests",
    // },
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

      <section className="w-full py-12 px-6 sm:px-12 shadow-inner bg-[#E9D3B4]">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-[#5A3F28]">
            Inspirations
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-[#5A3F28]">
            This project was inspired by various sources and individuals.
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
            Data was extracted from various sources.
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
