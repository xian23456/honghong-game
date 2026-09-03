import type { FaqItem } from "@/lib/types";

export const faqItems: FaqItem[] = [
  {
    question: "What is Inpainting?",
    answer: [
      {
        segments: [
          {
            type: "text",
            value:
              "Inpainting is a retouch technology used to remove any unwanted objects from photos (object removal). It can be used to remove an unwanted person. It used to work with a Clone tool like the inpaint, but using artificial intelligence gives much better results today.",
          },
        ],
      },
    ],
  },
  {
    question: "Why Cleanup.Pictures is better than other inpating app?",
    answer: [
      {
        segments: [
          {
            type: "text",
            value:
              "Cleanup.picture is an advanced editing tool based on Artificial Intelligence that is much better than other clone stamp tool. Clone tool like adobe photoshop fix, need a background reference, while our AI is truly able to guess what was behind the unwanted text, the unwanted people, unnecessary objects in just a few clicks.",
          },
        ],
      },
    ],
  },
  {
    question: "What image resolutions can cleanup.pictures handle?",
    answer: [
      {
        segments: [
          { type: "text", value: "You can import and edit picture of any size in Cleanup.pictures. Export will be limited to 720px for the free version. There is " },
          { type: "highlight", value: "no size limit" },
          {
            type: "text",
            value:
              " for the Pro version. We're continuously improving the quality of the image exported by Cleanup.pictures.",
          },
        ],
      },
    ],
  },
  {
    question: "How much Cleanup.pictures cost?",
    answer: [
      {
        segments: [
          { type: "text", value: "Cleanup.Picture is " },
          { type: "highlight", value: "free" },
          { type: "text", value: " unless you need better quality and process hi-resolution images. The price is then " },
          { type: "highlight", value: "$5 per month" },
          { type: "text", value: " or " },
          { type: "highlight", value: "$36 per year ($3 per month)" },
          { type: "text", value: " for processing images of any size. The trial allows testing the HD quality for free." },
        ],
      },
      {
        segments: [{ type: "text", value: "Your subscription will work on both mobile and desktop." }],
      },
    ],
  },
  {
    question: "What is your refund policy?",
    answer: [
      {
        segments: [
          {
            type: "text",
            value:
              "We provide a free trial period of our offering to let you fully evaluate it before you make the decision to purchase the full version. Please use the trial period to ensure our product meets your needs before purchasing a license.",
          },
        ],
      },
      {
        segments: [
          {
            type: "text",
            value:
              "Our support team is standing by to answer all your questions if need be. Please test the product's features and functionalities, and coordinate with our support team to clarify your doubts before making a final purchase.",
          },
        ],
      },
      {
        segments: [
          {
            type: "text",
            value:
              'The trial period that we offer should be considered a "free look period". During this time, we encourage you to use our solution, test it, and decide if you would like to purchase the full version.',
          },
        ],
      },
      {
        segments: [
          {
            type: "text",
            value:
              "Once you purchase the pro version of Cleanup.pictures, your license to use it will be activated after your payment has cleared. Once the license is activated, refunds will be given in the rarest cases such as technical difficulties, platform incompatibilities or other unforeseen circumstances.",
          },
        ],
      },
      {
        segments: [
          {
            type: "text",
            value:
              "In this case, refund will be total if the subscription is less than 14 days old and partial if the subscription is older. (Prorated to the amount of days since the subscription started).",
          },
        ],
      },
    ],
  },
  {
    question: "How to use Edit, Pause or Cancel my subscription?",
    answer: [
      {
        segments: [
          { type: "text", value: 'You can manage your subscription by visiting the "manage subscription" section: ' },
          { type: "image", src: "/help/manage-subscription.jpg", alt: "manage subscription" },
        ],
      },
    ],
  },
  {
    question: "How many users can use a Cleanup subscription?",
    answer: [
      {
        segments: [{ type: "text", value: "Each cleanup subscription is individual and limited to 1 user." }],
      },
    ],
  },
  {
    question: "How can I use the inpainting API?",
    answer: [
      {
        segments: [
          { type: "link", value: "Cleanup's API", href: "https://clipdrop.co/apis/docs/cleanup?utm_campaign=cleanup_pictures" },
          {
            type: "text",
            value:
              " can be used in any environment such as Node.js, SwiftUI, Kotlin..etc. We provide extensive documentation, a live demo and numerous samples to get started quickly.",
          },
        ],
      },
    ],
  },
  {
    question: "How to remove people from a photo?",
    answer: [
      {
        segments: [
          { type: "link", value: "cleanup.pictures", href: "https://cleanup.pictures" },
          {
            type: "text",
            value:
              " lets you remove people from a photo in a few seconds for free. You don't need complex softwares such as Adobe Photoshop. With ",
          },
          { type: "link", value: "cleanup.pictures", href: "https://cleanup.pictures" },
          { type: "text", value: " you can achieve professional results in a few clicks." },
        ],
      },
      {
        segments: [
          {
            type: "text",
            value:
              "Pro tip: Select a bigger brush and don't hesitate to cover more than the area you want to retouch (especially to cover shadows). It will help the algorithm create the best results.",
          },
        ],
      },
    ],
  },
  {
    question: "How to remove unwanted objects from a photo?",
    answer: [
      {
        segments: [
          {
            type: "text",
            value:
              "Use cleanup.pictures to remove unwanted objects, people, or defects. The A.I. algorithm will reconstruct what was behind the object in just one click. Be sure that the unwanted elements are covered to remove objects. You can remove persons, or remove text the same way.",
          },
        ],
      },
    ],
  },
  {
    question: "How to remove text, a logo or watermarks from an image?",
    answer: [
      {
        segments: [
          {
            type: "text",
            value:
              "You can remove unwanted text from a picture in a few seconds with impressive accuracy using cleanup.pictures. As for objects or people, simply load your image in the tool and draw over the text or watermark that you'd like to remove. After a few seconds, you'll see it completely gone.",
          },
        ],
      },
      {
        segments: [
          {
            type: "text",
            value:
              "Pro tip: To get the best results, make sure that you overflow and draw a slightly bigger area than what you actually want to remove.",
          },
        ],
      },
      {
        segments: [
          {
            type: "text",
            value:
              "Important: Watermarks usually indicate that an image has restrictive copyrights. Only remove watermarks on images for which you have an explicit license.",
          },
        ],
      },
    ],
  },
  {
    question: "How to remove blemish or wrinkles?",
    answer: [
      {
        segments: [
          {
            type: "text",
            value:
              "You can remove blemishes or wrinkles from your profile picture using the CleanUp brush. Like for another photo retouch, just be sure you overflow the brush over it, and download the result.",
          },
        ],
      },
    ],
  },
  {
    question: "How to remove the background of an image?",
    answer: [
      {
        segments: [
          {
            type: "text",
            value:
              "The best way to remove the background of a photo online or using your phone is using ClipDrop. It provides the best quality available today.",
          },
        ],
      },
    ],
  },
];
