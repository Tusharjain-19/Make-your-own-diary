"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-context";

export default function OrdersPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent text-white">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-semibold tracking-tight text-accent">
                Storybound
              </span>
            </Link>
            <span className="text-xs text-text-muted">/ Print Orders</span>
          </div>

          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="text-xs">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-text">
            My Hardcover Orders
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Track status of printed hardcover memory books for <strong>{user?.name}</strong>.
          </p>
        </div>

        <Card className="border border-border bg-surface p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Package className="h-6 w-6" />
          </div>
          <CardHeader>
            <CardTitle className="font-serif text-xl">No active print orders</CardTitle>
            <CardDescription>
              Hardcover printing and courier delivery tracking will be enabled in Week 4.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button size="sm">Go to My Books</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
