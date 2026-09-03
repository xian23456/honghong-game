import { UseCaseCopy } from "@/components/sections/use-cases/use-case-copy";
import { UseCaseImages } from "@/components/sections/use-cases/use-case-images";
import { TabsContent } from "@/components/ui/tabs";
import type { UseCase } from "@/lib/types";

/** 单个 use-case 面板：对比图 + 说明文案 */
export function UseCasePanel({ useCase }: { useCase: UseCase }) {
  return (
    <TabsContent value={useCase.key} className="mb-4">
      <UseCaseImages
        before={useCase.before}
        after={useCase.after}
        label={useCase.label}
      />
      <UseCaseCopy useCase={useCase} />
    </TabsContent>
  );
}
