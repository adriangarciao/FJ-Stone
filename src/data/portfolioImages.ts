import type { Project, ProjectImage } from '@/lib/types';

export interface PortfolioImageData {
  src: string;
  alt: string;
  caption: string;
}

export interface PortfolioProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  images: PortfolioImageData[];
}

// Raw portfolio data organized by project
export const portfolioProjectsRaw: PortfolioProjectData[] = [
  {
    id: "410-residence-brick",
    title: "410 Modern Brick Residence",
    category: "Residential Masonry",
    description: "Complete exterior brick work for a modern two-story home featuring white brick with black trim accents and natural wood porch columns.",
    images: [
      {
        src: "/images/0BA7ABEC-B3EB-4F73-A1F0-7880C507647C_1_105_c.jpeg",
        alt: "Front view of 410 residence",
        caption: "Full front facade showcasing white brick exterior with contemporary black window frames and covered front porch"
      },
      {
        src: "/images/0D2434A2-0F2D-490D-BE52-2E7A92F36A11_1_105_c.jpeg",
        alt: "410 residence alternate angle",
        caption: "Angled view highlighting the architectural details and natural wood porch posts"
      },
      {
        src: "/images/09ACDF43-4F23-49BE-B57E-4C8BE9E47859_1_105_c.jpeg",
        alt: "Window detail at 410 residence",
        caption: "Close-up of precision brick work around triple-pane windows with stone sill detail"
      },
      {
        src: "/images/67C7BD56-A300-44E7-AE11-566A95CCDD29_1_105_c.jpeg",
        alt: "Side brick detail",
        caption: "Side elevation showing consistent brick coursing and window integration"
      },
      {
        src: "/images/7AFE49EB-41DC-4763-BD38-CCFBF2A9627D_1_105_c.jpeg",
        alt: "410 residence with mature tree",
        caption: "Street view of completed residence nestled among mature landscaping"
      },
      {
        src: "/images/A08EEA7F-92D9-4F6F-93E6-2C03DFA2FBDF_1_105_c.jpeg",
        alt: "Brick facade close-up",
        caption: "Detail of white brick pattern and black trim coordination"
      },
      {
        src: "/images/A41EE63A-9DF7-44FF-AFB3-841C4CE70B22_1_105_c.jpeg",
        alt: "Front entry view",
        caption: "Welcoming front entry with covered porch and brick detailing"
      },
      {
        src: "/images/AB8207D4-CA1B-4220-8655-8AC43D388163_1_105_c.jpeg",
        alt: "Full property view",
        caption: "Complete view of the finished residence from the street"
      }
    ]
  },
  {
    id: "outdoor-fireplace-patio",
    title: "Outdoor Fireplace & Bluestone Patio",
    category: "Fire Feature",
    description: "Custom outdoor fireplace built with cream-colored brick featuring built-in wood storage niches, paired with a bluestone paver patio.",
    images: [
      {
        src: "/images/0834B227-14FC-4BBC-8EA1-FFA883885AA5_1_105_c.jpeg",
        alt: "Outdoor fireplace front view",
        caption: "Custom brick outdoor fireplace with dual wood storage compartments and copper chimney cap"
      },
      {
        src: "/images/37B30BC7-57DD-4BAD-A916-F5D72D6251C7_1_105_c.jpeg",
        alt: "Outdoor fireplace with patio",
        caption: "Full view of the fireplace with bluestone patio installation in progress"
      },
      {
        src: "/images/81C4B379-46BF-412A-B5A1-D6F54C804322_1_105_c.jpeg",
        alt: "Fireplace detail view",
        caption: "Completed fireplace showing clean brick work and integrated seating walls"
      },
      {
        src: "/images/F9C87C43-166D-441F-B9F0-310204055CE0_1_105_c.jpeg",
        alt: "Fireplace with worker",
        caption: "Final touches being applied to the outdoor fireplace and patio area"
      }
    ]
  },
  {
    id: "modern-white-siding-patio",
    title: "Modern Home Concrete Patio",
    category: "Patio",
    description: "Large-format concrete paver patio installation for a contemporary white-sided home with black trim accents.",
    images: [
      {
        src: "/images/285D1A83-1ACB-4929-B7E5-E32F20C29482_1_105_c.jpeg",
        alt: "Modern home patio",
        caption: "Expansive concrete paver patio complementing the modern farmhouse aesthetic"
      },
      {
        src: "/images/5402EED8-87E0-455A-B505-FB8ECA2F99BA_1_105_c.jpeg",
        alt: "Backyard patio view",
        caption: "Large-format pavers creating a clean, contemporary outdoor living space"
      },
      {
        src: "/images/55FEBE1D-B6B2-4CA3-A6F0-C932E1497ED1_1_105_c.jpeg",
        alt: "Backyard full view",
        caption: "Complete backyard transformation with new patio and walkway"
      },
      {
        src: "/images/CB7C01DD-714B-42C2-9A68-0CD6E76826B5_1_105_c.jpeg",
        alt: "Walkway and patio",
        caption: "Concrete walkway leading through the backyard"
      }
    ]
  },
  {
    id: "brick-ranch-paver-walkway",
    title: "Ranch Home Paver Walkway",
    category: "Walkway",
    description: "Charcoal and gray paver walkway installation connecting entryways at a brick ranch home.",
    images: [
      {
        src: "/images/0BC4764A-4D70-42EF-AFC7-E80351D67616_1_105_c.jpeg",
        alt: "Paver walkway side view",
        caption: "Multi-toned paver walkway with random pattern alongside brick ranch home"
      },
      {
        src: "/images/588AAD38-0528-4C23-AE36-BC3C60CEC66E_1_105_c.jpeg",
        alt: "Covered walkway view",
        caption: "Paver pathway extending through covered breezeway connecting home sections"
      }
    ]
  },
  {
    id: "backyard-patio-pergola",
    title: "Backyard Patio with Pergola",
    category: "Patio",
    description: "Large format cream-colored paver patio installation in a backyard with cedar pergola and outdoor grill area.",
    images: [
      {
        src: "/images/12751E82-0A2C-4BEE-A2BB-37804F8983C5_1_105_c.jpeg",
        alt: "Patio under construction",
        caption: "Large format paver installation creating generous outdoor living space"
      }
    ]
  },
  {
    id: "backyard-patio-trees",
    title: "Residential Patio with Landscaping",
    category: "Patio",
    description: "Charcoal gray paver patio surrounded by mature evergreens and established landscaping.",
    images: [
      {
        src: "/images/158AC9A7-D459-4A8D-8D0A-7236EBF09AB8_1_105_c.jpeg",
        alt: "Patio with evergreens",
        caption: "Freshly sealed patio pavers showcasing rich gray tones among lush landscaping"
      },
      {
        src: "/images/80AEF9C2-11A9-4C96-9D2C-26A952E84EE3_1_105_c.jpeg",
        alt: "Patio near white home",
        caption: "Stamped concrete patio creating elegant outdoor entertaining space"
      }
    ]
  },
  {
    id: "limestone-seating-wall",
    title: "Covered Pavilion with Stone Fireplace",
    category: "Outdoor Kitchen",
    description: "Natural limestone seating wall and covered pavilion with stone fireplace and bluestone patio.",
    images: [
      {
        src: "/images/1ED59034-25A7-4290-AE74-651000386F17_4_5005_c.jpeg",
        alt: "Limestone wall in progress",
        caption: "Natural limestone seating wall taking shape with paver patio foundation"
      },
      {
        src: "/images/8C6D78EA-AF10-4CD8-9E3C-C9D51ACE92CC_1_105_c.jpeg",
        alt: "Limestone wall construction",
        caption: "Natural limestone wall construction showing traditional dry-stack technique"
      },
      {
        src: "/images/9DF216A3-CFE2-4925-99B6-9D515C92B6F0_1_105_c.jpeg",
        alt: "Covered pavilion with fireplace",
        caption: "Completed outdoor pavilion featuring stone fireplace and bluestone patio"
      }
    ]
  },
  {
    id: "commercial-concrete-work",
    title: "Commercial Concrete Sidewalk",
    category: "Other",
    description: "Commercial concrete sidewalk installation at a shopping plaza with masonry block building.",
    images: [
      {
        src: "/images/3502BAF2-A98B-4EFB-9D79-31837D546FEC_1_105_c.jpeg",
        alt: "Commercial concrete pour",
        caption: "Fresh concrete pour for commercial sidewalk at retail plaza"
      }
    ]
  },
  {
    id: "taco-pros-concrete",
    title: "Taco Pros Restaurant Concrete Pad",
    category: "Other",
    description: "Commercial concrete pad and sidewalk installation at Taco Pros restaurant location.",
    images: [
      {
        src: "/images/3BCD50B8-4F83-4B79-B3F0-1EBBFEF3A90C_4_5005_c.jpeg",
        alt: "Taco Pros concrete pad",
        caption: "Freshly poured and finished concrete pad at Taco Pros restaurant entrance"
      }
    ]
  },
  {
    id: "dunkin-donuts-concrete",
    title: "Dunkin' Donuts Parking Area",
    category: "Other",
    description: "Commercial concrete work at Dunkin' Donuts location including parking area and sidewalks.",
    images: [
      {
        src: "/images/59AC0672-553C-4308-8724-5329C1E466FA_1_105_c.jpeg",
        alt: "Dunkin Donuts concrete",
        caption: "Completed concrete pad and sidewalk at Dunkin' Donuts drive-through area"
      }
    ]
  },
  {
    id: "flagstone-walkway-tudor",
    title: "Tudor Home Flagstone Walkway",
    category: "Walkway",
    description: "Natural flagstone walkway with brick border leading to a classic Tudor-style brick home.",
    images: [
      {
        src: "/images/5E3D4375-386D-4C1F-AC5F-36319F98C214_1_105_c.jpeg",
        alt: "Flagstone walkway",
        caption: "Winding natural flagstone path with brick edging through shaded garden"
      }
    ]
  },
  {
    id: "side-yard-walkway",
    title: "Side Yard Concrete Walkway",
    category: "Walkway",
    description: "Clean concrete paver walkway along the side of a residential home with decorative rock border.",
    images: [
      {
        src: "/images/65E4B190-8B28-4DF2-A1A2-8830F6443B44_1_105_c.jpeg",
        alt: "Side yard walkway",
        caption: "Large format concrete pavers creating accessible side yard pathway"
      }
    ]
  },
  {
    id: "unilock-patio-wall",
    title: "Unilock Patio with Seating Wall",
    category: "Patio",
    description: "Unilock paver patio installation with custom stone seating wall in residential backyard.",
    images: [
      {
        src: "/images/6DF5922B-CF4E-43F4-8819-AADA954E02F7_1_105_c.jpeg",
        alt: "Unilock patio construction",
        caption: "Tumbled stone seating wall construction with Unilock paver patio"
      }
    ]
  },
  {
    id: "new-construction-stone-veneer",
    title: "New Construction Stone Veneer",
    category: "Other",
    description: "Natural stone veneer installation on new construction home with covered porch area.",
    images: [
      {
        src: "/images/6E967199-7AA5-41CE-933A-3882E961C22D_1_105_c.jpeg",
        alt: "Stone veneer construction",
        caption: "Gray limestone veneer application on new home construction with Pella windows"
      },
      {
        src: "/images/A0906F3A-8497-4926-A78B-F72BA0C2D15D_1_105_c.jpeg",
        alt: "Full stone facade",
        caption: "Two-story stone veneer installation showcasing varied stone sizes and textures"
      }
    ]
  },
  {
    id: "paver-driveway",
    title: "Residential Paver Driveway",
    category: "Driveway",
    description: "Full paver driveway installation with contrasting border pattern at residential home.",
    images: [
      {
        src: "/images/73A1BE3C-0FE1-461F-AF66-2AEE21419E70_1_105_c.jpeg",
        alt: "Paver driveway",
        caption: "Interlocking paver driveway with dark border accent extending to garage"
      }
    ]
  },
  {
    id: "retaining-wall-landscape",
    title: "Landscape Retaining Wall",
    category: "Retaining Wall",
    description: "Natural stone retaining wall installation for landscape grade management.",
    images: [
      {
        src: "/images/7AFB6119-69B5-442B-8612-EA9ADE730550_4_5005_c.jpeg",
        alt: "Retaining wall",
        caption: "Curved natural stone retaining wall blending seamlessly with landscape"
      },
      {
        src: "/images/F1B772B6-F4A6-4213-BCC0-E8C44A9D9719_4_5005_c.jpeg",
        alt: "Retaining wall detail",
        caption: "Extended stone retaining wall following natural terrain contours"
      }
    ]
  },
  {
    id: "interior-stone-fireplace",
    title: "Interior Stacked Stone Fireplace",
    category: "Fire Feature",
    description: "Floor-to-ceiling stacked stone fireplace installation in vaulted living room.",
    images: [
      {
        src: "/images/8552BD59-EFAC-42FF-981E-6A4F56C9DDF2_1_105_c.jpeg",
        alt: "Stacked stone fireplace",
        caption: "Dramatic floor-to-vaulted-ceiling stacked stone fireplace with TV mount integration"
      }
    ]
  },
  {
    id: "firepit-stepping-stones",
    title: "Fire Pit with Flagstone Patio",
    category: "Fire Feature",
    description: "Circular flagstone patio with brick fire pit and natural stepping stone path at Tudor home.",
    images: [
      {
        src: "/images/822B1446-E587-45C5-B655-141F78127DCA_1_105_c.jpeg",
        alt: "Stepping stones to fire pit",
        caption: "Natural stepping stone path leading to circular fire pit area"
      },
      {
        src: "/images/8266D80D-6C3D-4094-8465-855A7B4FB7F0_1_105_c.jpeg",
        alt: "Fire pit patio complete",
        caption: "Completed flagstone patio with brick fire pit and log seating"
      },
      {
        src: "/images/FCEEF6FF-72C3-4EAF-9CEE-956F3367D4A1_1_105_c.jpeg",
        alt: "Fire pit with Tudor home",
        caption: "Rustic fire pit area perfectly complementing the Tudor-style architecture"
      }
    ]
  },
  {
    id: "multi-family-brick",
    title: "Multi-Family Brick Construction",
    category: "Other",
    description: "Brick exterior construction on new multi-family residential building.",
    images: [
      {
        src: "/images/AC18005E-CC1A-48E1-9F41-8BBAC71A7DCE_1_105_c.jpeg",
        alt: "Multi-family brick building",
        caption: "Traditional brick facade on new multi-family construction project"
      }
    ]
  },
  {
    id: "winter-brick-ranch",
    title: "Winter Ranch Home Brick Work",
    category: "Other",
    description: "Brick exterior work on ranch-style home during winter conditions.",
    images: [
      {
        src: "/images/B6881536-2380-4C42-87D9-9137A1F3C2F2_4_5005_c.jpeg",
        alt: "Brick ranch in snow",
        caption: "Completed brick work on ranch home photographed in winter snow"
      }
    ]
  },
  {
    id: "backyard-firepit",
    title: "Backyard Fire Pit Installation",
    category: "Fire Feature",
    description: "Circular stone fire pit with paver base in residential backyard setting.",
    images: [
      {
        src: "/images/BB37DE33-A631-42DA-857F-96D688BCE43A_4_5005_c.jpeg",
        alt: "Backyard fire pit",
        caption: "Two-tier stone fire pit with square paver base and landscape integration"
      }
    ]
  },
  {
    id: "interior-natural-stone-fireplace",
    title: "Natural Stone Interior Fireplace",
    category: "Fire Feature",
    description: "Traditional natural stone fireplace with wood beam mantel in living room.",
    images: [
      {
        src: "/images/BE8C7B11-7127-4C39-8667-372113C9B927_1_105_c.jpeg",
        alt: "Natural stone fireplace",
        caption: "Rustic natural stone fireplace with reclaimed wood mantel and traditional arch"
      }
    ]
  },
  {
    id: "brick-chimney",
    title: "Traditional Brick Chimney",
    category: "Other",
    description: "New brick chimney construction on white colonial-style home.",
    images: [
      {
        src: "/images/C20B505D-CD84-431F-80A5-41FACA97E394_1_105_c.jpeg",
        alt: "Brick chimney",
        caption: "Classic red brick chimney rising along the exterior of colonial home"
      }
    ]
  },
  {
    id: "gazebo-stonework",
    title: "Gazebo Curved Stonework",
    category: "Patio",
    description: "Curved concrete step and gravel border installation around elegant white gazebo.",
    images: [
      {
        src: "/images/D2463DC7-1486-4503-96EA-C692C327BB0F_1_105_c.jpeg",
        alt: "Gazebo stonework",
        caption: "Curved concrete steps and white gravel border enhancing classic gazebo"
      }
    ]
  },
  {
    id: "paver-walkway-residential",
    title: "Residential Paver Walkway",
    category: "Walkway",
    description: "Mixed-tone paver walkway installation along residential home.",
    images: [
      {
        src: "/images/E2566753-6896-455C-B1EC-F5A14BEF1740_4_5005_c.jpeg",
        alt: "Mixed paver walkway",
        caption: "Dual-tone paver walkway with brick border along side of home"
      }
    ]
  },
  {
    id: "mailbox-post-stonework",
    title: "Decorative Stone Mailbox Post",
    category: "Other",
    description: "Custom stone mailbox post enclosure with integrated lighting.",
    images: [
      {
        src: "/images/EA21903D-D4B8-427B-A2F2-69A4BC8BC784_1_105_c.jpeg",
        alt: "Stone mailbox post",
        caption: "Custom tumbled stone mailbox enclosure at rural property entrance"
      }
    ]
  }
];

// Convert raw data to Project format for use with existing components
export const portfolioProjects: Project[] = portfolioProjectsRaw.map((project, index) => ({
  id: project.id,
  title: project.title,
  slug: project.id,
  location: 'Chicagoland Area',
  service_type: project.category,
  description: project.description,
  featured: index < 6, // First 6 are featured
  is_published: true,
  created_at: new Date(2024, 11 - index % 12, 15).toISOString(),
  images: project.images.map((img, imgIndex) => ({
    id: `${project.id}-img-${imgIndex}`,
    project_id: project.id,
    storage_path: img.src,
    caption: img.caption,
    sort_order: imgIndex,
    created_at: new Date().toISOString(),
  })) as ProjectImage[],
}));

// Helper function to get all images flattened
export const getAllImages = (): (PortfolioImageData & { projectId: string; projectTitle: string })[] => {
  return portfolioProjectsRaw.flatMap(project =>
    project.images.map(image => ({
      ...image,
      projectId: project.id,
      projectTitle: project.title
    }))
  );
};

// Helper function to get projects by category
export const getProjectsByCategory = (category: string): Project[] => {
  return portfolioProjects.filter(project => project.service_type === category);
};

// Get all unique categories
export const getCategories = (): string[] => {
  return [...new Set(portfolioProjects.map(project => project.service_type))];
};

// Get featured projects
export const getFeaturedPortfolioProjects = (): Project[] => {
  return portfolioProjects.filter(project => project.featured);
};
