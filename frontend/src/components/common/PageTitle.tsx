interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    </div>
  );
}
