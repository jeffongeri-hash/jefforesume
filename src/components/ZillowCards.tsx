import { Home, ExternalLink, MapPin, Clock, TreePine, Star } from 'lucide-react';

interface ZillowListing {
  name: string;
  url: string;
  rent: string;
  ring?: string;
  commute?: string;
  vibe?: string;
  highlight?: string;
}

interface ZillowCardsProps {
  title?: string;
  listings: ZillowListing[];
}

const ringColors: Record<string, string> = {
  'Ring 1': 'bg-primary/15 text-primary border-primary/20',
  'Ring 2': 'bg-accent/50 text-accent-foreground border-accent/30',
  'Ring 3': 'bg-muted text-muted-foreground border-border',
  'Core': 'bg-primary/15 text-primary border-primary/20',
  'Inner': 'bg-primary/15 text-primary border-primary/20',
  'Suburb': 'bg-accent/50 text-accent-foreground border-accent/30',
  'Outer': 'bg-muted text-muted-foreground border-border',
};

const ZillowCards = ({ title = "Start Your Search", listings }: ZillowCardsProps) => {
  return (
    <div className="my-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
          <Home className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Live 3BR rental listings — prices update weekly
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {listings.map((listing) => {
          const ringStyle = listing.ring ? ringColors[listing.ring] || 'bg-muted text-muted-foreground border-border' : '';

          return (
            <a
              key={listing.name}
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Gradient header bar */}
              <div className="h-2 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />

              <div className="flex flex-col gap-3 p-4 flex-1">
                {/* Top row: name + ring badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {listing.name}
                    </span>
                  </div>
                  {listing.ring && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${ringStyle}`}>
                      {listing.ring}
                    </span>
                  )}
                </div>

                {/* Rent price — prominent */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-foreground">{listing.rent.split('–')[0]}</span>
                  {listing.rent.includes('–') && (
                    <span className="text-sm text-muted-foreground">– {listing.rent.split('–')[1]}</span>
                  )}
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  {listing.commute && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {listing.commute}
                    </span>
                  )}
                  {listing.vibe && (
                    <span className="flex items-center gap-1">
                      <TreePine className="h-3 w-3" />
                      {listing.vibe}
                    </span>
                  )}
                </div>

                {/* Highlight chip */}
                {listing.highlight && (
                  <div className="flex items-center gap-1.5 text-xs text-primary/80 bg-primary/5 rounded-md px-2 py-1 w-fit">
                    <Star className="h-3 w-3 fill-primary/40" />
                    {listing.highlight}
                  </div>
                )}

                {/* CTA */}
                <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-border/50 text-xs font-medium text-primary group-hover:text-primary/80 transition-colors">
                  View listings on Zillow
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ZillowCards;
