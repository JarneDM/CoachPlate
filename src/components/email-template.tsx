import * as React from "react";

interface EmailTemplateProps {
  name: string;
}

export function EmailTemplate({ name }: EmailTemplateProps) {
  return (
    <div>
      <h1>Goed nieuws!</h1>
      <p>{name} heeft zich geregistreerd!</p>
    </div>
  );
}
