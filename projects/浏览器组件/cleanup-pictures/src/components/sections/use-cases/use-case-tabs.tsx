"use client";

import { useState } from "react";

import { UseCasePanel } from "@/components/sections/use-cases/use-case-panel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCases } from "@/lib/data/use-cases";

/** Use-case 切换器：上排胶囊按钮 + 下方面板 */
export function UseCaseTabs() {
  const [active, setActive] = useState<string>(useCases[0].key);

  return (
    <Tabs value={active} onValueChange={setActive} className="mt-8 w-full">
      <TabsList aria-label="Use cases">
        {useCases.map((useCase) => (
          <TabsTrigger key={useCase.key} value={useCase.key}>
            {useCase.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {useCases.map((useCase) => (
        <UseCasePanel key={useCase.key} useCase={useCase} />
      ))}
    </Tabs>
  );
}
