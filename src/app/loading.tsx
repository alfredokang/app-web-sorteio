import LoadingSpinner from "@/app/components/LoadingSpinner2";

export default function Loading() {
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="relative">
            <LoadingSpinner
              size="lg"
              center={false}
              color="primary"
              showLabel={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
