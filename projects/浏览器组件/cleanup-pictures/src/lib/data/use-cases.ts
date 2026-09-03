import type { UseCase } from "@/lib/types";

export const useCases: UseCase[] = [
  {
    key: "photo",
    label: "Photographers",
    before: "/usecases/photo-a.jpg",
    after: "/usecases/photo-b.jpg",
    paragraphs: [
      "Photographers use Cleanup.pictures to remove time stamps or remove tourists from holiday pictures before printing them for their customers.",
      "They clean portrait photos to create the perfect profile pictures.",
      "Cleanup.pictures is the perfect app to remove cracks on photographs. You can clean any images, removing any unwanted things. It is a must-have for professional studios.",
    ],
  },
  {
    key: "agency",
    label: "Creative Agencies",
    before: "/usecases/agency-a.jpg",
    after: "/usecases/agency-b.jpg",
    paragraphs: [
      "Creatives use Cleanup's technology to quickly create stunning visuals.",
      "You can easily remix any existing photo to replace parts with your own.",
      "Stay in the creative flow by using tools that are not on your way.",
    ],
  },
  {
    key: "realestate",
    label: "Real Estate",
    before: "/usecases/realestate-a.jpg",
    after: "/usecases/realestate-b.jpg",
    paragraphs: [
      "Real Estate agents use CleanUp.pictures to remove unwanted objects from pictures.",
      "Cleanup.pictures technology allows you to depersonalize and clean your photos of any room, flat, house, or apartment.",
    ],
  },
  {
    key: "ecomm",
    label: "E-commerce",
    before: "/usecases/ecomm-a.jpg",
    after: "/usecases/ecomm-b.jpg",
    paragraphs: [
      "Make your online store shine. Simply upload photographs or your products directly on the plateform and create stunning product images.",
      "You can create the ideal product shot and quickly update your social media, with stunning visual for your instagram stories.",
    ],
  },
  {
    key: "watermark",
    label: "Remove text, logo or watermark",
    before: "/usecases/watermark-a.jpg",
    after: "/usecases/watermark-b.jpg",
    paragraphs: [
      "Cleanup.pictures is also useful to remove any unwanted text, logo, date stamp, or watermark.",
    ],
  },
  {
    key: "api",
    label: "Developers API",
    before: "/usecases/api.jpg",
    paragraphs: [
      "Do you need high-quality inpainting in your product? Check out",
    ],
    link: {
      label: "the API documentation",
      href: "https://clipdrop.co/apis/docs/cleanup?utm_campaign=cleanup_pictures",
      suffix: "(special pricing apply)",
    },
  },
];
