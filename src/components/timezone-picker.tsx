"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Toronto",
  "America/Vancouver",
  "America/Sao_Paulo",
  "America/Argentina/Buenos_Aires",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Amsterdam",
  "Europe/Moscow",
  "Europe/Istanbul",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
  "Africa/Cairo",
  "Africa/Lagos",
  "Africa/Johannesburg",
];

function formatTimezone(tz: string): string {
  return tz.replace(/_/g, " ").replace(/\//g, " / ");
}

export function TimezonePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (tz: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!search) return COMMON_TIMEZONES;
    const q = search.toLowerCase();
    return COMMON_TIMEZONES.filter((tz) => tz.toLowerCase().includes(q));
  }, [search]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full h-11 rounded-xl border-[#D2D2D7] bg-[#F5F5F7] justify-between text-left font-normal",
          !value && "text-[#86868B]"
        )}
      >
        {value ? formatTimezone(value) : "Select timezone"}
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-[#D2D2D7] bg-white shadow-lg max-h-[280px] overflow-hidden">
          <div className="p-2 border-b border-[#E5E5EA]">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search timezones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#F5F5F7] border-0 outline-none focus:ring-2 focus:ring-[#007AFF]/30"
            />
          </div>
          <div className="overflow-y-auto max-h-[230px]">
            {filtered.map((tz) => (
              <button
                key={tz}
                type="button"
                onClick={() => {
                  onChange(tz);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "w-full px-3 py-2 text-sm text-left hover:bg-[#F5F5F7] flex items-center justify-between",
                  value === tz && "bg-[#F0F0FF] text-[#007AFF]"
                )}
              >
                <span>{formatTimezone(tz)}</span>
                {value === tz && <Check className="h-4 w-4" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-sm text-[#86868B] text-center">
                No timezones found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}