"use client";

import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";
import { demoActivity } from "@/lib/constants";
import { ActivityItem } from "@/lib/types";

interface RealtimePayload {
  new: {
    id: string;
    name1: string;
    name2: string;
    grid_position: number;
    country_code?: string;
    created_at: string;
  };
}

interface ToastProps {
  initialItems?: ActivityItem[];
}

export function Toast({ initialItems = [] }: { initialItems?: ActivityItem[] }) {
  const [visible, setVisible] = useState<ActivityItem[]>([]);
  const items = useMemo(() => [...initialItems, ...demoActivity].slice(0, 3), [initialItems]);

  useEffect(() => {
    setVisible(items);
    const timer = window.setTimeout(() => setVisible([]), 4500);
    return () => window.clearTimeout(timer);
  }, [items]);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('squares-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'squares',
          filter: 'is_active=eq.true'
        }, 
        (payload: RealtimePayload) => {
          const newItem: ActivityItem = {
            id: payload.new.id,
            name1: payload.new.name1,
            name2: payload.new.name2,
            grid_position: payload.new.grid_position,
            country_code: payload.new.country_code || '',
            created_at: payload.new.created_at
          };
          setVisible(prev => [newItem, ...prev.slice(0, 1)]);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') console.log('Realtime toasts subscribed');
      });

    return () => {
      supabase!.removeChannel(channel);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,24rem)] flex-col gap-3">
      {visible.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-gold/20 bg-bg-card/95 px-4 py-3 text-sm text-text-primary shadow-card backdrop-blur"
        >
          <p className="font-medium">
            {item.name1} &amp; {item.name2} just reserved their square ❤
          </p>
          <p className="mt-1 text-text-secondary">Square #{item.grid_position.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
