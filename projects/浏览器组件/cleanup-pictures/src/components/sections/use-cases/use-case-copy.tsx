import type { UseCase } from "@/lib/types";

/** Use-case 说明文案：主色圆角卡片 */
export function UseCaseCopy({ useCase }: { useCase: UseCase }) {
  return (
    <p className="mx-auto mt-4 max-w-3xl rounded-3xl bg-primary p-4 text-base leading-relaxed">
      {useCase.paragraphs.map((paragraph, index) => (
        <span key={index}>
          {paragraph}
          {index < useCase.paragraphs.length - 1 ? <br /> : null}
        </span>
      ))}

      {useCase.link ? (
        <>
          {" "}
          <a
            href={useCase.link.href}
            target="_blank"
            rel="noreferrer"
            className="font-bold underline"
          >
            {useCase.link.label}
          </a>
          {useCase.link.suffix ? ` ${useCase.link.suffix}` : null}
        </>
      ) : null}
    </p>
  );
}
