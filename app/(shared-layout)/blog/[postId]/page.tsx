import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/commentSection";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { PostPresence } from "@/components/web/PostPresence";
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

interface PostIdRouteProps {
  params: {
    postId?: Id<"posts">;
  };
}

export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const postId = (await params)?.postId;

  if (!postId) {
    return {
      title: "Post",
    };
  }

  //const { postId } = params;

  const post = await fetchQuery(api.posts.getPostById, {
    postId,
  });

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.body,
  };
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const postId = (await params)?.postId;

  if (!postId) {
    return <div>Invalid post</div>;
  }

  //const { postId } = params;

  const token = await getToken();

  const [post, preloadedComments, userId] = await Promise.all([
    fetchQuery(api.posts.getPostById, { postId }),
    preloadQuery(api.comments.getCommentsByPostId, { postId }),
    fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  if (!userId) {
    return redirect("/auth/login");
  }

  if (!post) {
    return (
      <div className="text-4xl font-extrabold text-red-500 py-20">
        Post not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
        href="/blog"
      >
        <ArrowLeft className="size-4" />
        <span>Back</span>
      </Link>

      <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={
            post.imageUrl ??
            "https://images.unsplash.com/photo-1761839256601-e768233e25e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8"
          }
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Posted on:{" "}
            {new Date(post._creationTime).toLocaleDateString("en-US")}
          </p>
          {userId && <PostPresence roomId={post._id} userId={userId} />}
        </div>
      </div>

      <Separator className="my-8 h-2 bg-gray-500 dark:bg-gray-600" />

      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap mt-6">
        {post.body}
      </p>

      <Separator className="my-8 h-2 bg-gray-500 dark:bg-gray-600" />

      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}
