import { Home, ExternalLink } from 'lucide-react';

interface ZillowListing {
  name: string;
  url: string;
  rent: string;
  ring?: string;
}

interface ZillowCardsProps {
  title?: string;
  listings: ZillowListing[];
}

const ZillowCards = ({ title = "Start Your Search", listings }: ZillowCardsProps) => {
  return (
    <div className="my-10">
      <div className="flex items-center gap-3 mb-4">
        <Home className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Browse current 3BR rental listings for each suburb on Zillow. Prices change weekly — use these as a starting point.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {listings.map((listing) => (
          <a
            key={listing.name}
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                  {listing.name}
                </span>
                {listing.ring && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium flex-shrink-0">
                    {listing.ring}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{listing.rent}</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ZillowCards;
